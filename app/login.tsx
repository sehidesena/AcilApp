import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const genderOptions = ['Kadın', 'Erkek', 'Diğer'];
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [blood, setBlood] = useState('');
  const [illness, setIllness] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const router = useRouter();

  const saveData = async () => {
    if (!name || !age || !gender || !blood) {
      Alert.alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }
    try {
      const userData = { name, age, gender, blood, illness, emergencyContact };
      await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: Timestamp.now(),
      });
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
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
      <TextInput
        style={styles.input}
        placeholder="Cinsiyet Seçiniz"
        value={gender}
        onPressIn={() => setShowGenderOptions(true)}
        showSoftInputOnFocus={false}
        editable={false}
      />
      {showGenderOptions && (
        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderRadius: 5, marginBottom: 12, position: 'absolute', zIndex: 10, width: '100%' }}>
          {genderOptions.map((option) => (
            <Text
              key={option}
              style={{ padding: 10, fontSize: 16 }}
              onPress={() => {
                setGender(option);
                setShowGenderOptions(false);
              }}
            >
              {option}
            </Text>
          ))}
        </View>
      )}
      <TextInput style={styles.input} placeholder="Kan Grubu (örn: 0 Rh+)" onChangeText={setBlood} value={blood} />
      <TextInput style={styles.input} placeholder="Kronik Hastalık (opsiyonel)" onChangeText={setIllness} value={illness} />
      <TextInput style={styles.input} placeholder="Acil Kişi Telefon Numarası" keyboardType="phone-pad" onChangeText={setEmergencyContact} value={emergencyContact} />
      <Button title="Kaydet ve Devam Et" onPress={saveData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 12, padding: 10, borderRadius: 5, fontSize: 16 },
});
