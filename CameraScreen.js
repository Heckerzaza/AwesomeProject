import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { addImageToHistory } from "./Home";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRdata from "./validQRCodes.json";

export default function CameraScreen() {
const [facing, setFacing] = useState('back');
const [permission, requestPermission] = useCameraPermissions();
const [flashlightOn, setFlashlightOn] = useState(false);
const [photo, setPhoto] = useState(null);
const cameraRef = useRef(null);
const navigation = useNavigation();
const [location, setLocation] = useState(null);
const [scannedBarcode, setScannedBarcode] = useState(null);
const [isScanning, setIsScanning] = useState(true);
const [validQRCodes, setValidQRCodes] = useState([]);
const [AllQRCodes, setAllQRCodes] = useState(QRdata);
const [scanSuccess, setScanSuccess] = useState(false); // Added state for success message

useEffect(() => {
    (async () => {
        // Location permissions
        let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus !== 'granted') {
            Alert.alert('Permission Denied', 'Please allow location permission.');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        // Load QR codes from AsyncStorage
        try {
            const storedQRCodes = await AsyncStorage.getItem('userValidQRCodes');
            if (storedQRCodes) {
                setValidQRCodes(JSON.parse(storedQRCodes));
            } else {
                setValidQRCodes(QRdata);
            }
        } catch (error) {
            console.error("Error fetching user QR codes:", error);
            setValidQRCodes(QRdata);
        }
    })();
}, []);

async function takePicture() {
  if (cameraRef.current) {
      try {
          const photo = await cameraRef.current.takePictureAsync();

          // Get current date/time
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
              barcode: scannedBarcode || 'N/A',
          };

          addImageToHistory(newImageData); // Save image data
          if (scannedBarcode !== "N/A") {
            saveBarcode(scannedBarcode); // Save barcode to storage
          }
          resetCamera(); // Reset for next scan
      } catch (error) {
          console.error("Error taking picture:", error);
      }
  }
}


async function handleSelect() {
   //No More Select Button
}

function resetCamera() {
    setPhoto(null);
    setIsScanning(true);
    setScannedBarcode(null);
    setScanSuccess(false); // Reset success message
}

const handleBarcodeScanned = ({ data }) => {
    if (isScanning) {
        setIsScanning(false); // Stop scanning immediately
        setScanSuccess(false); // Reset success message state

        console.log("Scanned data:", data);
        console.log("AllQRCodes:", AllQRCodes);
        console.log("validQRCodes:", validQRCodes);

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
            setScanSuccess(true); // Set success state to trigger message

          setTimeout(() => {
            takePicture() // Automatically take picture
          }, 500); // Delay a bit before taking the picture

        } else {
            Alert.alert(
                `Invalid QR Code`,
                `Data: ${data} is not in our database`,
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
            );
            setScannedBarcode(null); // Ensure set to null if it is not valid
            setScanSuccess(false);
        }
      setTimeout(() => {
            setIsScanning(true); // Re-enable scanning after the delay
        }, 2500); // 2500ms delay (2.5 seconds)
    }
};

const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
};

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

const renderCameraContent = () => {
    if (scanSuccess) {
      return (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>QR Code Scanned Successfully!</Text>
        </View>
      );
    } else {
      return (
        <CameraView
            style={styles.camera}
            facing={facing}
            flash={flashlightOn ? 'on' : 'off'}
            ref={cameraRef}
            onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
            barcodeScannerSettings={{
                barcodeTypes: ["qr"],
            }}
        >
            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity style={styles.circleButton} onPress={toggleCameraFacing}>
                    <Text style={styles.buttonText}>⟳</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                    <Text style={styles.buttonText}></Text>
                </TouchableOpacity>

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
    <View style={styles.blankSpace} />
    <Text style={styles.title}>Scan QR Code</Text>
    <View style={styles.line} />
        {renderCameraContent()}
    <View style={styles.blankSpace} />
    <View style={styles.blankSpace} />
              {/* Title */}
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
    alignItems: 'center',
    borderRadius: 25,
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
    width : "95%",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
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
    zIndex: 2,
    },
    circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    },
    captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
    },
    selectButton: {
    position: 'absolute',
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    bottom: 10,
    zIndex: 4,
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
    zIndex: 6,
    },
    homeButtonText: {
    fontSize: 24,
    color: 'white',
    },
    blankSpace: {  // Add a blank space at the bottom
    height: 60,  // Adjust the height as needed
    },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
    left: -50,
    top: 1,
    marginBottom: 20, // Add some space below the title
    },
    line: {
    top: -5,
    height: 2,
    width: '100%',
    backgroundColor: 'black',
    },
    successContainer: { // Style for success message
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    },
    successText: {  // Style for success text
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    },
    }); 