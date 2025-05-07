import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { db } from '../firebase';

export default function HealthInfoScreen() {
  const [name, setName] = useState('');
  const [blood, setBlood] = useState('');
  const [illness, setIllness] = useState('');
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
        setIllness(user.illness);
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

  if (loading) return <Text>Yükleniyor...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sağlık Bilgilerim</Text>
      <Text style={styles.label}>Ad Soyad: {name}</Text>
      <Text style={styles.label}>Yaş: {age}</Text>
      <Text style={styles.label}>Cinsiyet: {gender}</Text>
      <Text style={styles.label}>Kan Grubu: {blood}</Text>
      <Text style={styles.label}>Kronik Hastalık: {illness || '-'}</Text>
      <Button title="Bilgileri Düzenle" onPress={() => setEditing(true)} />
      {editing && (
        <View style={{marginTop: 20}}>
          <TextInput style={styles.input} placeholder="Ad Soyad" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Yaş" value={age} onChangeText={setAge} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Cinsiyet" value={gender} onChangeText={setGender} />
          <TextInput style={styles.input} placeholder="Kan Grubu" value={blood} onChangeText={setBlood} />
          <TextInput style={styles.input} placeholder="Kronik Hastalık" value={illness} onChangeText={setIllness} />
          <Button title="Kaydet" onPress={updateData} />
          <Button title="Vazgeç" color="gray" onPress={() => setEditing(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5, fontSize: 16 },
  label: { fontSize: 16, marginBottom: 8 },
});