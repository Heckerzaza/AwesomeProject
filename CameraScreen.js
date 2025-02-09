import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Toggle between front and back camera
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  // Toggle flashlight on/off
  function toggleFlashlight() {
    setFlashlightOn(current => !current);
  }

  // Take a picture
  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri); // Save the photo URI
    }
  }

  // Handle "Select" button press
  function handleSelect() {
    console.log('Photo selected:', photo); // Add your logic here (e.g., save or upload the photo)
    resetCamera(); // Automatically reset the camera
  }

  // Reset the camera view
  function resetCamera() {
    setPhoto(null);
  }

  return (
    <View style={styles.container}>
      {photo ? (
        // Show the captured photo
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.previewImage} />
          <View style={styles.bottomButtonsContainer}>
            {/* Select Button */}
            <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
              <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Show the camera view
        <CameraView
          style={styles.camera}
          facing={facing}
          flash={flashlightOn ? 'on' : 'off'}
          ref={cameraRef}
        >
          <View style={styles.bottomButtonsContainer}>
            {/* Flip Camera Button */}
            <TouchableOpacity style={styles.circleButton} onPress={toggleCameraFacing}>
              <Text style={styles.buttonText}>⟳</Text>
            </TouchableOpacity>

            {/* Take Photo Button */}
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Text style={styles.buttonText}>📸</Text>
            </TouchableOpacity>

            {/* Flashlight Button */}
            <TouchableOpacity style={styles.circleButton} onPress={toggleFlashlight}>
              <Text style={styles.buttonText}>{flashlightOn ? '🔦' : '⚡️'}</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
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
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButton: {
    position: 'absolute',
    right: 20, // Position the "Select" button at the bottom left
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
  },
});