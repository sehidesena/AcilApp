// screens/UserInfoScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserInfoScreen({ navigation }) {
  const [name, setName] = useState('');
  const [blood, setBlood] = useState('');
  const [illness, setIllness] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const saveData = async () => {
    if (!name || !blood || !emergencyContact) {
      Alert.alert('Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    const userData = { name, blood, illness, emergencyContact };
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    navigation.replace('Home'); // Ana sayfaya geç
  };

  return (
    <View style={styles.container}>
      <Text>Ad Soyad</Text>
      <TextInput style={styles.input} onChangeText={setName} />
      <Text>Kan Grubu</Text>
      <TextInput style={styles.input} onChangeText={setBlood} />
      <Text>Kronik Hastalık (opsiyonel)</Text>
      <TextInput style={styles.input} onChangeText={setIllness} />
      <Text>Acil Kişi Telefon Numarası</Text>
      <TextInput style={styles.input} keyboardType="phone-pad" onChangeText={setEmergencyContact} />
      <Button title="Kaydet ve Devam Et" onPress={saveData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 }
});
