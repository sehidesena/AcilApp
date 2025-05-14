import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Contacts from 'expo-contacts';
import { addDoc, collection, getDocs, query, Timestamp, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Button, FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebase';

export default function ContactsScreen() {
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [allContacts, setAllContacts] = useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      // AsyncStorage'dan acil kişiler yükleniyor
      const saved = await AsyncStorage.getItem('emergencyContacts');
      if (saved) {
        setSelectedContacts(JSON.parse(saved));
      } else {
        // Firestore'dan yükleme (isteğe bağlı, offline için gerek yok)
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
        const q = query(collection(db, 'emergencyContacts'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const contacts = querySnapshot.docs.map(doc => doc.data().contact);
        setSelectedContacts(contacts);
        AsyncStorage.setItem('emergencyContacts', JSON.stringify(contacts));
      }
    })();
  }, []);

  const pickContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Rehber erişim izni verilmedi.');
      return;
    }
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });
    setAllContacts(data.filter((c) => c.phoneNumbers && c.phoneNumbers.length > 0));
    setModalVisible(true);
  };

  const handleSelectContact = async (contact: any) => {
    if (selectedContacts.find((c) => c.id === contact.id)) return;
    if (selectedContacts.length >= 3) {
      Alert.alert('Sınır', 'En fazla 3 kişi seçebilirsiniz.');
      return;
    }
    const updated = [...selectedContacts, contact];
    setSelectedContacts(updated);
    AsyncStorage.setItem('emergencyContacts', JSON.stringify(updated));
    setModalVisible(false);
    // Firestore'a da kaydet
    const userId = await AsyncStorage.getItem('userId');
    if (userId) {
      await addDoc(collection(db, 'emergencyContacts'), {
        userId,
        contact,
        createdAt: Timestamp.now(),
      });
    }
  };

  const removeContact = async (id: string) => {
    const updated = selectedContacts.filter((c) => c.id !== id);
    setSelectedContacts(updated);
    AsyncStorage.setItem('emergencyContacts', JSON.stringify(updated));
    // Firestore'dan silmek için ek kod eklenebilir (isteğe bağlı)
  };

  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.title}>Acil Kişi Listesi</Text>
      <View style={{ width: '100%', marginTop: 10 }}>
        <Button
          title="Rehberden Kişi Seç"
          onPress={pickContacts}
          color="#007AFF"
        />
      </View>
      <View style={{ width: '100%', alignItems: 'center', marginTop: 20 }}>
        {selectedContacts.length === 0 ? (
          <Text style={styles.label}>Henüz kişi seçilmedi.</Text>
        ) : (
          selectedContacts.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.contactCard}>
              <Text style={styles.contactText}>{item.name} ({item.phoneNumbers?.[0]?.number || '-'})</Text>
              <TouchableOpacity onPress={() => removeContact(item.id)}>
                <Text style={styles.removeText}>Kaldır</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Kişi Seç</Text>
          <FlatList
            data={allContacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleSelectContact(item)} style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
                <Text>{item.name} ({item.phoneNumbers?.[0]?.number || '-'})</Text>
              </Pressable>
            )}
          />
          <Button title="Kapat" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  label: { fontSize: 16, marginBottom: 8 },
  contactCard: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactText: { fontSize: 16 },
  removeText: { color: 'red', marginLeft: 12 },
});
