import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from './firebase';

export default function TabTwoScreen() {
  const [name, setName] = useState('');
  const [blood, setBlood] = useState('');
  const [illness, setIllness] = useState<string[]>([]);
  const [illnessInput, setIllnessInput] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('userInfo');
      if (saved) {
        const user = JSON.parse(saved);
        setName(user.name);
        setBlood(user.blood);
        setIllness(Array.isArray(user.illness) ? user.illness : user.illness ? [user.illness] : []);
        setAge(user.age || '');
        setGender(user.gender || '');
      }
      setLoading(false);
    })();
  }, []);

  const updateData = async () => {
    if (!name || !blood || !age || !gender) {
      Alert.alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }
    if (isNaN(Number(age))) {
      Alert.alert('Yaş alanı sadece sayı olmalı.');
      return;
    }
    try {
      const userData = { name, blood, illness, age, gender };
      await addDoc(collection(db, 'users'), {
        ...userData,
        updatedAt: Timestamp.now(),
      });
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
      Alert.alert('Bilgiler güncellendi!');
      setEditing(false);
    } catch (e) {
      Alert.alert('Güncelleme sırasında hata oluştu.');
      console.log(e);
    }
  };

  const handleGenderSelect = () => {
    Alert.alert(
      'Cinsiyet Seçiniz',
      '',
      [
        { text: 'Kadın', onPress: () => setGender('Kadın') },
        { text: 'Erkek', onPress: () => setGender('Erkek') },
        { text: 'Diğer', onPress: () => setGender('Diğer') },
        { text: 'İptal', style: 'cancel' },
      ]
    );
  };

  const addIllness = () => {
    if (illnessInput.trim() && !illness.includes(illnessInput.trim())) {
      setIllness([...new Set([...illness, illnessInput.trim()])]);
      setIllnessInput('');
    }
  };

  const removeIllness = (item: string) => {
    setIllness(illness.filter(i => i !== item));
  };

  if (loading) return <Text>Yükleniyor...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sağlık Bilgilerim</Text>
      <Text style={styles.label}>Ad Soyad: {name}</Text>
      <Text style={styles.label}>Yaş: {age}</Text>
      <Text style={styles.label}>Cinsiyet: {gender}</Text>
      <Text style={styles.label}>Kan Grubu: {blood}</Text>
      <Text style={styles.label}>Kronik Hastalıklar: {illness.length > 0 ? illness.join(', ') : '-'}</Text>
      <Button title="Bilgileri Düzenle" onPress={() => setEditing(true)} />
      {editing && (
        <View style={{marginTop: 20}}>
          <TextInput style={styles.input} placeholder="Ad Soyad" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Yaş" value={age} onChangeText={setAge} keyboardType="numeric" />
          <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={handleGenderSelect}>
            <Text style={{ color: gender ? '#111' : '#888', fontSize: 16 }}>{gender || 'Cinsiyet Seçiniz'}</Text>
          </TouchableOpacity>
          <TextInput style={styles.input} placeholder="Kan Grubu" value={blood} onChangeText={setBlood} />
          <View style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Kronik Hastalık Ekle"
                value={illnessInput}
                onChangeText={setIllnessInput}
              />
              <Button title="Ekle" onPress={addIllness} />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
              {illness.map((item, index) => (
                <TouchableOpacity key={`${item}-${index}`} style={styles.illnessTag} onPress={() => removeIllness(item)}>
                  <Text style={{ color: '#fff' }}>{item} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Button title="Kaydet" onPress={updateData} />
          <Button title="Vazgeç" color="gray" onPress={() => setEditing(false)} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5, fontSize: 16 },
  label: { fontSize: 16, marginBottom: 8 },
  illnessTag: {
    backgroundColor: '#888',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
});
