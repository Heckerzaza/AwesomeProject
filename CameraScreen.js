import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // Null, 'success', 'error'

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({ quality: 0.5, exif: false }); // Adjust quality for smaller file size if needed
      setCapturedImage(data.uri);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setUploadStatus(null); // Reset upload status
  };

  const handleUpload = async () => {
    if (!capturedImage) return;

    setUploading(true);
    setUploadStatus(null); // Reset upload status

    try {
      // First, resize the image (important for performance and upload speeds)
      const resizedImage = await ImageManipulator.manipulateAsync(
        capturedImage,
        [{ resize: { width: 800 } }], // Adjust width as needed, keeps aspect ratio
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // JPEG is smaller, adjust compress as needed
      );

      const formData = new FormData();
      formData.append('photo', {
        uri: resizedImage.uri, // Use the URI of the resized image
        type: 'image/jpeg', // Adjust type if you use a different format
        name: 'photo.jpg', // Adjust name as needed
      });

      const apiUrl = 'YOUR_UPLOAD_API_ENDPOINT'; // Replace with your API endpoint

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Upload successful!', data);
      setUploadStatus('success');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRetake}>
              <Text style={styles.text}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleUpload} disabled={uploading}>
              <Text style={styles.text}>{uploading ? 'Uploading...' : 'Upload'}</Text>
            </TouchableOpacity>
          </View>

          {uploadStatus === 'success' && (
            <Text style={styles.statusTextSuccess}>Upload successful!</Text>
          )}
          {uploadStatus === 'error' && (
            <Text style={styles.statusTextError}>Upload failed. Please try again.</Text>
          )}
        </View>
      ) : (
        <Camera
          style={styles.camera}
          type={type}
          ref={(ref) => setCamera(ref)}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={styles.text}> Flip </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}> Take Picture </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.5, // Adjusted to share space equally
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#DDDDDD', // Added background for visibility
    padding: 10,
    marginHorizontal: 5, // Added spacing between buttons
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '80%',
    height: '70%',
    resizeMode: 'contain', // Important for fitting the image
  },
  statusTextSuccess: {
    color: 'green',
    marginTop: 10,
    fontSize: 16,
  },
  statusTextError: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
  },
});
