import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const MapScreen = ({ route }) => {
  const { location } = route.params; 
  const [region, setRegion] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    const initializeMap = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission to access location was denied.");
        return;
      }

      if (location && location.latitude && location.longitude) {
        setRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } else {
        const userLocation = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    };

    initializeMap();
  }, [location]);

  const handleZoomIn = () => {
    if (mapRef && region) {
      const newRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta / 2,
        longitudeDelta: region.longitudeDelta / 2,
      };
      setRegion(newRegion);
      mapRef.animateToRegion(newRegion, 100);
    }
  };

  const handleZoomOut = () => {
    if (mapRef && region) {
      const newRegion = {
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      };
      setRegion(newRegion);
      mapRef.animateToRegion(newRegion, 100);
    }
  };

  const handleCurrentLocation = async () => {
    const userLocation = await Location.getCurrentPositionAsync({});
    const newRegion = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
    setRegion(newRegion);
    mapRef?.animateToRegion(newRegion, 100);
  };

  if (!region) {
    return <Text>Loading map...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        ref={(ref) => setMapRef(ref)}
      >
        <Marker coordinate={region} title="Therapist Location" />
      </MapView>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleZoomIn}>
          <Ionicons name="add-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleZoomOut}>
          <Ionicons name="remove-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCurrentLocation}>
          <Ionicons name="locate-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  buttonsContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'column',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
});

export default MapScreen;
