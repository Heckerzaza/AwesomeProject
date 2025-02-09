import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Alert, TextInput, Keyboard, AppState } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import markersData from "./markers.json";
import debounce from 'lodash.debounce';

const GeolocationScreen = ({ navigation }) => {
  const [region, setRegion] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [nearbyBins, setNearbyBins] = useState([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [allMarkers, setAllMarkers] = useState(markersData);
  const [showTrashBins, setShowTrashBins] = useState(false);
  const [customRadius, setCustomRadius] = useState(""); // For custom radius input
  const [radius, setRadius] = useState(null); // For selected radius
  const [isMenuVisible, setIsMenuVisible] = useState(false); // Toggle the visibility of radius options
  const [isButtonsVisible, setIsButtonsVisible] = useState(true); // To hide/show buttons
  const [showCustomInput, setShowCustomInput] = useState(false); // To show/hide custom input zone
  const [showCustomInputOverlay, setShowCustomInputOverlay] = useState(false); // To show transparent overlay
  const [isUserActive, setIsUserActive] = useState(true); // To track user activity
  const [isLoading, setIsLoading] = useState(true); // To track loading state
  const [loadingText, setLoadingText] = useState("loading."); // To manage loading text
  const [initialLocationFetched, setInitialLocationFetched] = useState(false);
  const [isTrashBinLoading, setIsTrashBinLoading] = useState(false);

  useEffect(() => {
    const getLocationPermissions = async () => {
      try {
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          Alert.alert("Error", "Location services are disabled. Please enable them.");
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Permission to access location was denied.");
          setPermissionGranted(false);
          return;
        }

        setPermissionGranted(true);
        await fetchCurrentLocation();
      } catch (error) {
        console.error("Error during permission request:", error);
        Alert.alert("Error", "An unexpected error occurred while requesting location permissions.");
      }
    };

    getLocationPermissions();
  }, []);

  useEffect(() => {
    const loadingTexts = ["loading.", "loading..", "loading..."];
    let index = 0;
    let interval;
  
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingText(loadingTexts[index]);
        index = (index + 1) % loadingTexts.length;
      }, 500);
    }
  
    return () => clearInterval(interval);
  }, [isLoading]);
  
  const fetchCurrentLocation = async () => {
    try {
      const location = await Promise.race([
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Location timeout')), 10000)
        )
      ]);
  
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
  
      setRegion(newRegion);
      setMarkerPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setInitialLocationFetched(true);
      setIsLoading(false);
  
    } catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert("Error", "Unable to fetch location. Please try again.");
      setIsLoading(false);
    }
  };
  
  // Update moveToCurrentLocation function
  const moveToCurrentLocation = async () => {
    if (!initialLocationFetched) {
      Alert.alert("Error", "Initial location not yet available");
      return;
    }
  
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
  
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
  
      setRegion(newRegion);
      setMarkerPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Unable to update location");
    }
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    const newMarker = {
      id: allMarkers.length + 1,
      latitude,
      longitude,
    };

    setAllMarkers([...allMarkers, newMarker]);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const showTrashBinsWithinRadius = useCallback(async (selectedRadius) => {
    if (!initialLocationFetched) {
      Alert.alert("Error", "Initial location not yet available");
      return;
    }
  
    try {
      setIsTrashBinLoading(true);
      const { latitude, longitude } = markerPosition;
  
      // Optimize with precomputed distances
      const binsWithinRadius = [];
      await Promise.all(
        allMarkers.map((marker) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            marker.latitude,
            marker.longitude
          );
  
          if (distance <= selectedRadius) {
            binsWithinRadius.push(marker); // Add valid bins directly
          }
        })
      );
  
      if (binsWithinRadius.length === 0) {
        Alert.alert("No Trash Bins Found", "No trash bins found within the selected radius.");
      }
  
      setNearbyBins(binsWithinRadius);
      setShowTrashBins(true);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Unable to fetch trash bins");
    } finally {
      setIsTrashBinLoading(false);
    }
  }, [allMarkers, markerPosition, initialLocationFetched]);
  
  const handleShowTrashBinMenu = () => {
    if (!initialLocationFetched) {
      Alert.alert("Error", "Please wait for location to be initialized");
      return;
    }
    setIsMenuVisible(!isMenuVisible);
    setIsButtonsVisible(false);
  };

  const handleRadiusSelection = (selectedRadius) => {
    setRadius(selectedRadius);
    showTrashBinsWithinRadius(selectedRadius);
    setIsMenuVisible(false);
    setIsButtonsVisible(true); // Show main buttons after selecting a radius
  };

  const handleCustomRadiusSubmit = () => {
    if (customRadius && !isNaN(customRadius)) {
      const selectedRadius = parseFloat(customRadius);
      setRadius(selectedRadius);
      showTrashBinsWithinRadius(selectedRadius);
      setIsMenuVisible(false);
      setIsButtonsVisible(true); // Show main buttons after submitting custom radius
      setShowCustomInput(false); // Hide custom input zone after submission
      setShowCustomInputOverlay(false); // Hide the transparent overlay
    } else {
      Alert.alert("Invalid Radius", "Please enter a valid number for the radius.");
    }
  };

  useEffect(() => {
    if (showCustomInput) {
      Keyboard.dismiss(); // Hide keyboard first
    }
  }, [showCustomInput]);

  // Debounced function to handle custom radius input
  const handleCustomRadiusChange = useCallback(
    debounce((text) => {
      setCustomRadius(text);
    }, 300),
    []
  );

  // Monitor user activity
  useEffect(() => {
    let timeout;
    const handleUserActivity = () => {
      setIsUserActive(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsUserActive(false);
      }, 5000); // 5 seconds of inactivity
    };

    const subscription = AppState.addEventListener('change', handleUserActivity);

    return () => {
      subscription.remove();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && (
        <>
          <View style={styles.mapOverlay} />
          <View style={styles.overlayTextContainer}>
            <Text style={styles.overlayText}>{loadingText}</Text>
            <Text style={styles.overlayText}>this should take not long</Text>
          </View>
        </>
      )}
  
      {region && (
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
          onPress={handleMapPress}
        >
          {markerPosition && (
            <Marker
              coordinate={markerPosition}
              pinColor="red"
              title="You are here"
              zIndex={999}
            />
          )}
  
          {showTrashBins &&
            nearbyBins.map((bin) => (
              <Marker
                key={bin.id}
                coordinate={{
                  latitude: bin.latitude,
                  longitude: bin.longitude,
                }}
                pinColor="blue"
                title="Trash Bin"
              />
            ))}
        </MapView>
      )}

      {isTrashBinLoading && (
        <>
          <View style={styles.mapOverlay} />
          <View style={styles.overlayTextContainer}>
            <Text style={styles.overlayText}>Fetching trash bins...</Text>
          </View>
        </>
      )}
  
      <TouchableOpacity style={styles.circleButton} onPress={() => navigation.goBack()}>
        <Text style={styles.circleButtonText}>{"<"}</Text>
      </TouchableOpacity>
  
      <View style={styles.buttonContainer}>
        {isButtonsVisible && (
          <>
            <TouchableOpacity style={styles.actionButton} onPress={moveToCurrentLocation}>
              <Text style={styles.actionButtonText}>Current Location</Text>
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.actionButton} onPress={handleShowTrashBinMenu}>
              <Text style={styles.actionButtonText}>Show Trash Bin</Text>
            </TouchableOpacity>
          </>
        )}
  
        {isMenuVisible && (
          <View style={styles.radiusMenu}>
            <TouchableOpacity
              style={styles.radiusButton}
              onPress={() => handleRadiusSelection(100)}
            >
              <Text style={styles.radiusButtonText}>100m</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radiusButton}
              onPress={() => handleRadiusSelection(250)}
            >
              <Text style={styles.radiusButtonText}>250m</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radiusButton}
              onPress={() => handleRadiusSelection(500)}
            >
              <Text style={styles.radiusButtonText}>500m</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radiusButton}
              onPress={() => {
                setShowCustomInput(true);
                setShowCustomInputOverlay(true);
              }}
            >
              <Text style={styles.radiusButtonText}>Custom</Text>
            </TouchableOpacity>
          </View>
        )}
  
        {showCustomInput && (
          <>
            <View style={styles.overlay}></View>
            <View style={styles.customRadiusZone}>
              <TextInput
                style={styles.customRadiusInput}
                placeholder="Enter custom radius"
                keyboardType="numeric"
                value={customRadius}
                onChangeText={handleCustomRadiusChange}
                autoFocus
              />
              <TouchableOpacity style={styles.selectButton} onPress={handleCustomRadiusSubmit}>
                <Text style={styles.selectButtonText}>Select</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );  
};

export default GeolocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  map: {
    width: "100%",
    height: "75%",
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(128, 128, 128, 0.5)", // Gray transparency overlay
    zIndex: 1,
  },
  overlayTextContainer: {
    position: 'absolute',
    top: '50%',
    left: '39%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 2,
  },
  overlayText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  circleButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  circleButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  actionButton: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: "center",
    width: "80%",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  radiusMenu: {
    width: "80%",
    alignItems: "center",
    marginVertical: 10,
  },
  radiusButton: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginVertical: 5,
    alignItems: "center",
    width: "100%",
  },
  radiusButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  customRadiusZone: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3, // Ensure it appears above the overlay
  },
  customRadiusInput: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginRight: 10,
    width: "60%",
    borderWidth: 1,
    borderColor: "#000000",
  },
  selectButton: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Transparency overlay
    zIndex: 1,
  },
  customRadiusZone: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -450 }], // Adjusted for centering
    width: 300,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 3, // Ensure it appears above the map
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  customRadiusInput: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10, // Space between input and button
  },
  selectButton: {
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
  },
  selectButtonText: { 
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(128, 128, 128, 0.5)", // Slightly transparent overlay
    zIndex: 3, // Ensure it appears under the custom input
  },
});
