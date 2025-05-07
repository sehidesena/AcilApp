import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ContactsScreen() {
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);

  React.useEffect(() => {
    // Uygulama açıldığında kayıtlı kişileri yükle
    (async () => {
      const saved = await AsyncStorage.getItem('emergencyContacts');
      if (saved) setSelectedContacts(JSON.parse(saved));
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
    if (data.length > 0) {
      // Kullanıcıya seçim için basit bir liste sun
      const firstThree = data.slice(0, 20); // örnek olarak ilk 20 kişiyi göster
      Alert.alert(
        'Kişi Seç',
        'Acil durumda bildirim alacak kişileri seçin (max 3)',
        [
          ...firstThree.map((c) => ({
            text: c.name,
            onPress: () => handleSelectContact(c),
          })),
          { text: 'İptal', style: 'cancel' },
        ]
      );
    }
  };

  const handleSelectContact = (contact: any) => {
    if (selectedContacts.find((c) => c.id === contact.id)) return;
    if (selectedContacts.length >= 3) {
      Alert.alert('Sınır', 'En fazla 3 kişi seçebilirsiniz.');
      return;
    }
    const updated = [...selectedContacts, contact];
    setSelectedContacts(updated);
    AsyncStorage.setItem('emergencyContacts', JSON.stringify(updated));
  };

  const removeContact = (id: string) => {
    const updated = selectedContacts.filter((c) => c.id !== id);
    setSelectedContacts(updated);
    AsyncStorage.setItem('emergencyContacts', JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acil Kişi Listesi</Text>
      <Button title="Rehberden Kişi Seç" onPress={pickContacts} />
      <FlatList
        data={selectedContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text>{item.name} ({item.phoneNumbers?.[0]?.number || '-'})</Text>
            <TouchableOpacity onPress={() => removeContact(item.id)}>
              <Text style={{ color: 'red' }}>Kaldır</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>Henüz kişi seçilmedi.</Text>}
      />
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
});
