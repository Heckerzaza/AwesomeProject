import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [cameraRef, setCameraRef] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    })();
  }, []);

  const handleTakePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
      const newPhoto = {
        uri: photo.uri,
        timestamp: new Date().toLocaleString(),
      };
      setPhotos([newPhoto, ...photos]);
    }
  };

  const handleToggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleToggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  if (hasCameraPermission === null || hasMediaLibraryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>ไม่มีสิทธิ์เข้าถึงกล้อง</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={cameraType}
        flashMode={flashMode}
        ref={(ref) => setCameraRef(ref)}
      >
        <View style={styles.controlContainer}>
          <TouchableOpacity style={styles.control} onPress={handleToggleFlash}>
            <Text style={styles.controlText}>แฟลช</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
            <Text style={styles.captureButtonText}>ถ่ายรูป</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.control} onPress={handleToggleCameraType}>
            <Text style={styles.controlText}>สลับกล้อง</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.uri}
        renderItem={({ item }) => (
          <View style={styles.photoItem}>
            <Image source={{ uri: item.uri }} style={styles.photo} />
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  controlContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    alignItems: 'flex-end',
  },
  control: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  controlText: {
    color: 'white',
    fontSize: 16,
  },
  captureButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
  },
  captureButtonText: {
    color: 'white',
    fontSize: 16,
  },
  photoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  timestamp: {
    marginLeft: 10,
    fontSize: 16,
  },
});
