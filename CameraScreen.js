import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { addImageToHistory } from "./Home";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import QRdata from "./validQRCodes.json"; // Import the default QR codes from file

export default function CameraScreen() {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [flashlightOn, setFlashlightOn] = useState(false);
    const [photo, setPhoto] = useState(null);
    const cameraRef = useRef(null);
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);
    const [scannedBarcode, setScannedBarcode] = useState(null); // State to store scanned barcode data
    const [isScanning, setIsScanning] = useState(true); // Control barcode scanning
    const [validQRCodes, setValidQRCodes] = useState([]);
    const [AllQRCodes, setAllQRCodes] = useState(QRdata); // Default QRCodes From Data files

    useEffect(() => {
        (async () => {
            let { status: locationStatus } = await Location.requestForegroundPermissionsAsync(); // Request location permissions
            if (locationStatus !== 'granted') {
                Alert.alert('Permission Denied', 'Please allow location permission to use this feature.');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            // Fetch user-defined QR codes from AsyncStorage
            try {
                const storedQRCodes = await AsyncStorage.getItem('userValidQRCodes');
                if (storedQRCodes) {
                    setValidQRCodes(JSON.parse(storedQRCodes)); // Load stored codes into state
                } else {
                    setValidQRCodes(QRdata) // use defualt
                }
            } catch (error) {
                console.error("Error fetching user QR codes from AsyncStorage:", error);
                setValidQRCodes(QRdata) // If theres any error just load defualt
            }
        })();
    }, []);

    //Take Picture
    async function takePicture() {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                setPhoto(photo.uri); // Save the photo URI

                // Get current date and time
                const now = new Date();
                const formattedTime = now.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }) + ' ' + now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });

                const newImageData = {
                    latitude: location?.coords.latitude || 'N/A',
                    longitude: location?.coords.longitude || 'N/A',
                    time: formattedTime,
                    barcode: scannedBarcode || 'N/A',  // Store the barcode data or 'N/A' if null
                };
                console.log(photo);
                //addImageToHistory(newImageData);

            } catch (error) {
                console.error("Error taking picture:", error);
            }
        }
    }

    // Handle "Select" button press
    async function handleSelect() {
        console.log('Photo selected:', photo); // Add your logic here (e.g., save or upload the photo)

        // Get current date and time
        const now = new Date();
        const formattedTime = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }) + ' ' + now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        const newImageData = {
            latitude: location?.coords.latitude || 'N/A',
            longitude: location?.coords.longitude || 'N/A',
            time: formattedTime,
            barcode: scannedBarcode || 'N/A', // Store the barcode data or 'N/A' if null
        };

        addImageToHistory(newImageData);
        if (scannedBarcode !=="N/A") {  // Only save if there's a barcode that's not N/A
          saveBarcode(scannedBarcode); // Save the barcode to local storage
        }
        resetCamera(); // Automatically reset the camera

    }

    // Reset the camera view
    function resetCamera() {
        setPhoto(null);
        setIsScanning(true); // Allow scanning again
        setScannedBarcode(null); // Clear the scanned barcode
    }

    const handleBarcodeScanned = ({ data }) => {
      if (isScanning) {
          setIsScanning(false); // Stop scanning immediately
  
          let isValid = false;
  
          if (AllQRCodes.includes(data)) { // Check if the scanned QR code is valid from QRdatas
              isValid = true;
          } else if (validQRCodes.includes(data)) {//Check from localStorage UserData to validate
              isValid = true;
          }
  
          if (isValid) {
              Alert.alert(
                  `QR Code Scanned Successfully!`,
                  `Data: ${data}`,
                  [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
              );
              setScannedBarcode(data);
          } else {
              Alert.alert(
                  `Invalid QR Code`,
                  `Data: ${data} is not in our databased`,
                  [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
              );
              setScannedBarcode(null); // Ensure set to null if it is not valid
          }
        setTimeout(() => {
              setIsScanning(true); // Re-enable scanning after the delay
          }, 2500); // 2500ms delay (2.5 seconds)
      }
  };
    // Function to toggle camera facing
    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };
    // Function to toggle flashlight on/off
    const toggleFlashlight = () => {
        setFlashlightOn(current => !current);
    };

    const saveBarcode = async (barcode) => {
        try {
            await AsyncStorage.setItem('lastScannedBarcode', barcode);
            console.log('Barcode saved to local storage:', barcode);
        } catch (error) {
            console.error('Error saving barcode to local storage:', error);
        }
    };
        //For Camera
        const renderCameraContent = () => {
            if (photo) {
              return (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: photo }} style={styles.previewImage} />
                  {scannedBarcode && <Text>Barcode: {scannedBarcode}</Text>}
                  <View style={styles.bottomButtonsContainer}>
                    {/* Select Button */}
                    <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
                      <Text style={styles.buttonText}>Select</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            } else {
              return (
                <CameraView
                  style={styles.camera}
                  facing={facing}
                  flash={flashlightOn ? 'on' : 'off'}
                  ref={cameraRef}
                  onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined} // Only scan when isScanning is true
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr"], // Only scan QR codes
                  }}
                >
                  <View style={styles.bottomButtonsContainer}>
                    {/* Flip Camera Button */}
                    <TouchableOpacity style={styles.circleButton} onPress={toggleCameraFacing}>
                      <Text style={styles.buttonText}>⟳</Text>
                    </TouchableOpacity>

                    {/* Take Photo Button */}
                    <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                      <Text style={styles.buttonText}></Text>
                    </TouchableOpacity>

                    {/* Flashlight Button */}
                    <TouchableOpacity style={styles.circleButton} onPress={toggleFlashlight}>
                      <Text style={styles.buttonText}>{flashlightOn ? '⚡︎' : '⚡︎'}</Text>
                    </TouchableOpacity>
                  </View>
                </CameraView>
              );
            }
          };

    return (
        <View style={styles.container}>
                    {renderCameraContent()}
            {/* Add blank space at the bottom */}
            <View style={styles.blankSpace} />
            {/* Return to Home Button */}
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.homeButtonText}>{"<"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        fontSize: 16,
    },
    permissionButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
    },
    permissionButtonText: {
        color: 'white',
        fontSize: 16,
    },
    camera: {
        flex: 1,
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    bottomButtonsContainer: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        zIndex: 2, // Ensure it appears under the camera view and bottom buttons container
    },
    circleButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2, // Ensure it appears under the camera view and bottom buttons container
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 4, // Ensure it appears under the camera view and bottom buttons container
    },
    selectButton: {
        position: 'absolute',
        right: 20, // Position the "Select" button at the bottom left
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 5,
        bottom: 10,
        zIndex: 4, // Ensure it appears under the camera view and bottom buttons container
    },
    buttonText: {
        fontSize: 24,
        color: 'black',
    },
    homeButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 6, // Ensure it appears above all other elements
    },
    homeButtonText: {
        fontSize: 24,
        color: 'white',
    },
});