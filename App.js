import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GeolocationScreen from './GeolocationScreen';
import CameraScreen from './CameraScreen';
import Home from "./Home";
import RewardsScreen from "./Rewards";

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Center image touchable */}
      <TouchableOpacity
        style={[styles.centerImageContainer]} // Modified style here
        onPress={() => navigation.navigate('Home')}
      >
        <Image
          source={require('./assets/welcome-image.png')}
          style={styles.centerImage}
        />
      </TouchableOpacity>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Geolocation" component={GeolocationScreen} />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
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
  centerImageContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -75 }],
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerImage: {
    width: 150,
    height: 150,
  },
});