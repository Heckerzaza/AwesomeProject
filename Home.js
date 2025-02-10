import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

const Home = ({ navigation }) => {
  const [imageHistory, setImageHistory] = useState([]);
  const [filter, setFilter] = useState(null); // null, 'day', 'month', 'year', 'time'

  useFocusEffect(
    useCallback(() => {
      fetchImageHistory();
    }, [])
  );

  const fetchImageHistory = async () => {
    try {
        const storedHistory = await AsyncStorage.getItem('imageHistory');
        const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];

        // Debugging: Log the parsed history to check for errors.
        console.log("fetchImageHistory - parsedHistory:", parsedHistory); // Debugging
        setImageHistory(parsedHistory);
    } catch (error) {
        console.error("Error fetching image history:", error);
    }
};

const renderItem = ({ item, index }) => {
  return (
      <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
          <Text style={[styles.cell, { flex: 0.3 }]}>{index + 1}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>{item.time}</Text>
          <Text style={[styles.cell, { flex: 0.3 }]}>{'Waiting...'}</Text>
      </View>
  );
};

return (
  <View style={styles.container}>
    {/* Add blank space at the top */}
    <View style={styles.blankSpaceTop} />

    {/* Title */}
    <Text style={styles.title}>Home</Text>

    <View style={styles.line} />

    {/* History Table */}
    <View style={styles.table}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { flex: 0.3 }]}>No.</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Time</Text>
        <Text style={[styles.headerCell, { flex: 0.3 }]}>Status</Text>
      </View>
      <FlatList
        data={imageHistory}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeScreen')}>
        <Ionicons name="home" size={24} color="black" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Geolocation')}>
        <Ionicons name="map" size={24} color="black" />
        <Text style={styles.navText}>Maps</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rewards')}>
        <Ionicons name="trophy" size={24} color="black" />
        <Text style={styles.navText}>Rewards</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Setting')}>
        <Ionicons name="settings" size={24} color="black" />
        <Text style={styles.navText}>Settings</Text>
      </TouchableOpacity>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  table: {
    flex: 1,
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    paddingVertical: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
  },
  blankSpaceTop: {
    height: 30, // Add blank space at the top
  },
  circleButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  circleButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomRightContainer: {
    position: 'absolute',
    bottom: 20, // Adjust the distance from the bottom as needed
    right: 20, // Adjust the distance from the right as needed
    alignItems: 'center', // Align items horizontally
    padding: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    left: 30,
    top: 18,
    marginBottom: 20, // Add some space below the title
  },
  line: {
    height: 2,
    width: '100%',
    backgroundColor: 'black',
  },
});

export default Home;

// Function to add a new item to the history
export const addImageToHistory = async (newImage) => {
  try {
      const storedHistory = await AsyncStorage.getItem('imageHistory');
      const history = storedHistory ? JSON.parse(storedHistory) : [];

      // Add status to the newImage object BEFORE adding to history
      const newImageWithStatus = { ...newImage, status: 'Waiting...' }; // Add the status here

      const newHistory = [...history, newImageWithStatus];
      await AsyncStorage.setItem('imageHistory', JSON.stringify(newHistory));
      console.log("addImageToHistory - newHistory after save", newHistory); // Debugging
  } catch (error) {
      console.error("Error adding image to history:", error);
  }
};