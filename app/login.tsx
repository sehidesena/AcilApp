import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../firebase';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [blood, setBlood] = useState('');
  const [illness, setIllness] = useState('');
  const router = useRouter();

  const saveData = async () => {
    if (!name || !age || !gender || !blood) {
      Alert.alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }
    try {
      const userData = { name, age, gender, blood, illness };
      // Firestore'a kullanıcıyı ekle ve id'yi al
      const userRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: Timestamp.now(),
      });
      const userId = userRef.id;
      // AsyncStorage'a userId ve userData kaydet
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('userInfo', JSON.stringify({ ...userData, userId }));
      Alert.alert('Kayıt başarılı!');
      router.replace('/');
    } catch (e) {
      Alert.alert('Kayıt sırasında hata oluştu.');
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sağlık Bilgileri</Text>
      <TextInput style={styles.input} placeholder="Ad Soyad" onChangeText={setName} value={name} />
      <TextInput style={styles.input} placeholder="Yaş" onChangeText={setAge} value={age} keyboardType="numeric" />
  
      <TouchableOpacity
        style={[styles.input, { justifyContent: 'center' }]}
        onPress={() => {
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
        }}
      >
        <Text style={{ color: gender ? '#111' : '#888', fontSize: 16 }}>
          {gender || 'Cinsiyet Seçiniz'}
        </Text>
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder="Kan Grubu (örn: 0 Rh+)" onChangeText={setBlood} value={blood} />
      <TextInput style={styles.input} placeholder="Kronik Hastalık (opsiyonel)" onChangeText={setIllness} value={illness} />
      <Button title="Kaydet ve Devam Et" onPress={saveData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5, fontSize: 16 },
});
