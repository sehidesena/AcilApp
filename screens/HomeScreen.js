import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const HomeScreen = () => {
  const handlePanicButtonPress = () => {
    console.log('Panik Butonuna Basıldı!');
    // Burada panik butonu işlevselliğini çağıracağız
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acil Yardım Uygulaması</Text>
      <TouchableOpacity style={styles.panicButton} onPress={handlePanicButtonPress}>
        <Text style={styles.panicButtonText}>PANİK</Text>
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