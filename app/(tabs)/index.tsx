import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SMS from 'expo-sms';

const HomeScreen = () => {
  const handlePanicButtonPress = async () => {
    try {
      // 1. Konum al
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Konum izni reddedildi');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      // 2. Acil kişileri al
      const saved = await AsyncStorage.getItem('emergencyContacts');
      let numbers = [];
      if (saved) {
        const contacts = JSON.parse(saved);
        numbers = contacts.map((c: any) => c.phoneNumbers?.[0]?.number).filter(Boolean);
      }
      // 3. Kullanıcı adını al (ör: AsyncStorage'dan)
      const userInfo = await AsyncStorage.getItem('userInfo');
      const user = userInfo ? JSON.parse(userInfo) : {};
      // 4. SMS mesajı hazırla
      const message = `ACİL DURUM! ${user.name || ''} acil durumda. Konum: https://maps.google.com/?q=${loc.coords.latitude},${loc.coords.longitude}`;
      // 5. SMS gönder
      if (numbers.length > 0) {
        const isAvailable = await SMS.isAvailableAsync();
        if (isAvailable) {
          await SMS.sendSMSAsync(numbers, message);
          Alert.alert('Acil durum bildirimi gönderildi!');
        } else {
          alert('SMS servisi kullanılamıyor.');
        }
      } else {
        alert('Acil kişi seçilmedi!');
      }
    } catch (e) {
      console.log('Hata:', e);
      alert('Bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acil Yardım Uygulaması</Text>
      <TouchableOpacity style={styles.panicButton} onPress={handlePanicButtonPress}>
        <Text style={styles.panicButtonText}>ACİL</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>Yardım istemek için yukarıdaki butona basın.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  panicButton: {
    backgroundColor: 'red',
    borderRadius: 80,
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5, // Android için gölge
    shadowColor: '#000', // iOS için gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  panicButtonText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },
});

export default HomeScreen;