import Constants from 'expo-constants';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Konum izni reddedildi');
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoading(false);
      fetchNearbyPlaces(loc.coords);
    })();
  }, []);

  // Benzersiz place_id'ye göre filtreleme fonksiyonu
  function getUniquePlaces(places: any[]) {
    const seen = new Set();
    return places.filter((place) => {
      const key = place.place_id + '-' + place.type;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  const fetchNearbyPlaces = async (coords: { latitude: number; longitude: number }) => {
    try {
      const apiKey = Constants.expoConfig?.extra?.GOOGLE_PLACES_API_KEY;
      const types = ['hospital', 'police', 'park', 'local_government_office']; // zabıta için local_government_office eklendi
      let allResults: any[] = [];
      for (const type of types) {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coords.latitude},${coords.longitude}&radius=3000&type=${type}&key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results) {
          allResults = allResults.concat(data.results.map((item: any) => ({ ...item, type })));
        }
      }
      setPlaces(allResults);
    } catch (e) {
      console.log('Yerler alınamadı:', e);
      
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="red" />;
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
        >
          <Marker coordinate={location} title="Şu Anki Konum" />
          {getUniquePlaces(places).map((place, idx) => (
            <Marker
              key={place.place_id + '-' + place.type}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
              pinColor={
                place.type === 'hospital' ? 'red' :
                place.type === 'police' ? 'blue' :
                place.type === 'local_government_office' ? 'blue' : // zabıta da mavi
                'green'
              }
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
