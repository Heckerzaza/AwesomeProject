import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location'; // Expo Location API for GPS
import MapView, { Marker } from 'react-native-maps'; // For map and marker selection

// Dummy data for trash bins (this would be replaced by actual scanning or nearby results)
const trashBins = [
  { id: 1, name: 'Trash Bin 1', latitude: 13.7367, longitude: 100.5231 },
  { id: 2, name: 'Trash Bin 2', latitude: 13.7380, longitude: 100.5235 },
  { id: 3, name: 'Trash Bin 3', latitude: 13.7400, longitude: 100.5240 },
  // More trash bins would be here or scanned dynamically
];

// Haversine formula to calculate the distance between two coordinates
const Haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance * 1000; // Return distance in meters
};

export default function ScanScreen() {
  const [location, setLocation] = useState(null); // To store current or chosen location
  const [selectedLocation, setSelectedLocation] = useState(null); // To store chosen location
  const [isScanning, setIsScanning] = useState(false); // Track scanning state
  const [scanRadius, setScanRadius] = useState(100); // Initial scan radius (100 meters)
  const [scanningProgress, setScanningProgress] = useState('Not Started');

  // Get the current location of the user
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      // Get the current location of the user
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    };

    getLocation();
  }, []);

  const handleLocationSelect = (e) => {
    // When the user selects a location on the map
    const selected = e.nativeEvent.coordinate;
    setSelectedLocation(selected);
  };

  const checkNearbyBins = async () => {
    if (!selectedLocation) {
      Alert.alert('Location not selected', 'Please select a location to scan for trash bins.');
      return;
    }

    setIsScanning(true);
    setScanningProgress('Scanning...');
    
    const { latitude, longitude } = selectedLocation;
    let found = false;
    let radius = scanRadius;
    let maxRadius = 1000; // Maximum scanning distance (e.g., 1000 meters = 1 km)
    let scanAttempts = 0;

    // Continue scanning while the radius is within the limit and no bin is found
    while (radius <= maxRadius && !found) {
      setScanningProgress(`Scanning within ${radius} meters...`);
      scanAttempts++;

      // Scan all trash bins within the defined radius
      for (let bin of trashBins) {
        const distance = Haversine(latitude, longitude, bin.latitude, bin.longitude);
        if (distance <= radius) {
          found = true;
          Alert.alert('Nearby Trash Bin Found!', `Found: ${bin.name} at ${distance.toFixed(2)} meters.`);
          break;
        }
      }

      if (!found) {
        radius += 100; // Increase radius by 100 meters and retry
      }
    }

    // If no trash bins are found within the maximum radius, alert the user
    if (!found) {
      Alert.alert('No Trash Bins Found', 'No trash bins found within the selected search area.');
    }

    setIsScanning(false);
    setScanningProgress('Scan Complete');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Map to choose location */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location ? location.latitude : 13.7367, // Default to current location
          longitude: location ? location.longitude : 100.5231,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleLocationSelect}
      >
        {/* Marker for the current location (if available) */}
        {location && (
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="You are here" />
        )}

        {/* Marker for the selected location */}
        {selectedLocation && (
          <Marker coordinate={selectedLocation} title="Selected Location" />
        )}
      </MapView>

      {/* Button to start scanning */}
      <TouchableOpacity
        style={{
          backgroundColor: '#0066CC',
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
          borderRadius: 5,
        }}
        onPress={checkNearbyBins}
        disabled={isScanning} // Disable while scanning
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>
          {isScanning ? 'Scanning...' : 'Scan for Trash Bins'}
        </Text>
      </TouchableOpacity>

      {/* Display scanning progress */}
      <Text style={{ textAlign: 'center', fontSize: 16 }}>
        {scanningProgress} 
      </Text>
    </View>
  );
}
