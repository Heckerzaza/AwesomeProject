import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GeolocationScreen from './GeolocationScreen';
import CameraScreen from './CameraScreen';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Left side touch for Camera */}
      <TouchableOpacity
        style={[styles.touchableArea, styles.leftSide]}
        onPress={() => navigation.navigate('Camera')}
      />
      {/* Right side touch for Geolocation */}
      <TouchableOpacity
        style={[styles.touchableArea, styles.rightSide]}
        onPress={() => navigation.navigate('Geolocation')}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Geolocation" component={GeolocationScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  touchableArea: {
    flex: 1,
  },
  leftSide: {
    backgroundColor: 'transparent',
  },
  rightSide: {
    backgroundColor: 'transparent',
  },
});
