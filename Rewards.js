import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function App() {
  const [selectedTab, setSelectedTab] = useState("discounts");
  const navigation = useNavigation(); // Initialize navigation

  // Mock Data for Discounts
  const discountsItems = [
    { id: "1", title: "Eco-Friendly App Discount 20฿" },
    { id: "2", title: "Food Delivery Discount 50฿" },
    { id: "3", title: "Shopping Discount 100฿" },
    { id: "4", title: "Streaming Service Discount 30฿" },
    { id: "5", title: "Gym Membership Discount 200฿" },
  ];

  // Mock Data for Goods & Money
  const goodsItems = [
    { id: "6", title: "Laundry Detergent" },
    { id: "7", title: "Toothbrush" },
    { id: "8", title: "Soap" },
    { id: "9", title: "Shampoo" },
    { id: "10", title: "Cash 500฿" },
    { id: "11", title: "Cash 1,000฿" },
    { id: "12", title: "Cash 2,000฿" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.blankSpace} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Redeem Rewards</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>💎 999999+</Text>
        </View>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedTab === "discounts" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("discounts")}
        >
          <Text style={styles.toggleText}>
            Redeem Points for Discounts
          </Text>
        </TouchableOpacity>

        {/* Back Icon */}
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeButtonText}>{"<"}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedTab === "goods" && styles.activeTab,
          ]}
          onPress={() => setSelectedTab("goods")}
        >
          <Text style={styles.toggleText}>
            Redeem Points for Goods & Cash
          </Text>
        </TouchableOpacity>
      </View>

      {/* List of Items */}
      <FlatList
        data={selectedTab === "discounts" ? discountsItems : goodsItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemText}>{item.title}</Text>
            </View>
            <TouchableOpacity style={styles.redeemButton}>
              <Text style={styles.redeemText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#E5B80B",
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    position: 'relative',
    left: 60,
  },
  balanceContainer: {
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  balanceText: {
    color: "#E5B80B",
    fontWeight: "bold",
  },
  toggleContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#E5B80B",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  redeemButton: {
    backgroundColor: "#E5B80B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  redeemText: {
    color: "#fff",
    fontWeight: "bold",
  },
    homeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    },
    homeButtonText: {
      color: "#000",
      fontWeight: "bold",
    },
  blankSpace: {
    height: 40,
  },
  homeButton: {
    position: 'absolute',
    top: -53,
    left: 15,
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
});