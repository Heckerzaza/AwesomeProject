import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  const fadeOutAnim = new Animated.Value(1); // Initial opacity for "𝗕𝗜𝗡𝗜𝗧𝗨𝗣"
  const fadeInAnim = new Animated.Value(0);  // Initial opacity for "Welcome to the App!"

  const handlePress = () => {
    // Animate the "𝗕𝗜𝗡𝗜𝗧𝗨𝗣" to fade out
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 500, // Half-second fade-out duration
      useNativeDriver: true,
    }).start();

    // After 1 second, show the "Welcome to the App!" page and fade it in
    setTimeout(() => {
      setShowWelcome(true);
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 500, // Half-second fade-in duration
        useNativeDriver: true,
      }).start();
    }, 1000); // Wait 1 second before fading in "Welcome to the App!"
  };

  const handleBack = () => {
    // Animate the "Welcome to the App!" to fade out
    Animated.timing(fadeInAnim, {
      toValue: 0,
      duration: 500, // Half-second fade-out duration
      useNativeDriver: true,
    }).start();

    // After the "Welcome to the App!" fades out, show the "𝗕𝗜𝗡𝗜𝗧𝗨𝗣" page and fade it in
    setTimeout(() => {
      setShowWelcome(false);
      Animated.timing(fadeOutAnim, {
        toValue: 1,
        duration: 500, // Half-second fade-in duration
        useNativeDriver: true,
      }).start();
    }, 500); // Wait until fade-out is complete before fading in the next screen
  };

  // Automatically transition after the first screen is loaded
  useEffect(() => {
    if (!showWelcome) {
      handlePress();
    }
  }, [showWelcome]);

  return (
    <View style={styles.container}>
      {/* Button to go back */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>

      {/* Main screen area */}
      <View style={styles.screen}>
        {/* Animated View for "𝗕𝗜𝗡𝗜𝗧𝗨𝗣" */}
        <Animated.View style={[styles.textContainer, { opacity: fadeOutAnim }]}>
          {!showWelcome && <Text style={styles.text}>𝗕𝗜𝗡𝗜𝗧𝗨𝗣</Text>}
        </Animated.View>

        {/* Animated View for "Welcome to the App!" */}
        <Animated.View style={[styles.textContainer, { opacity: fadeInAnim }]}>
          {showWelcome && <Text style={styles.text}>Bitkub</Text>}
        </Animated.View>

        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // White background
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#000000', // Black button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    zIndex: 1, // Ensure it stays on top of other elements
  },
  buttonText: {
    color: 'white', // White text on black button
    fontSize: 18,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
