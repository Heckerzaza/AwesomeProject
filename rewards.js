import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // ADD THIS

const Rewards = () => {
    const navigation = useNavigation();  // AND THIS

  // Dummy data for rewards (replace with your actual data)
  const rewardsData = [
    { id: '1', title: 'Eco-Friendly Water Bottle', points: 1000 },
    { id: '2', title: 'Reusable Shopping Bag', points: 500 },
    { id: '3', title: 'Bamboo Utensil Set', points: 750 },
    { id: '4', title: 'Composting Starter Kit', points: 2000 },
    { id: '5', title: 'Donation to Environmental Charity', points: 3000 },
    { id: '6', title: 'Discount at Local Eco-Store', points: 1500 },
    { id: '7', title: 'Sustainable Cleaning Products', points: 1200 },
    { id: '8', title: 'Seed Packet for Native Plants', points: 300 },
    { id: '9', title: 'Metal Straw Set', points: 600 },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.rewardItem}>
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardTitle}>{item.title}</Text>
      </View>
      <View style={styles.rewardButton}>
        <Text style={styles.rewardButtonText}>{item.points} Points</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton}  onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Rewards</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>999999+</Text>
          {/* You might want to use an actual icon here */}
          <Text style={{ color: 'white', fontSize: 16 }}> 💎 </Text>
        </View>
      </View>

      {/* Reward List */}
      <FlatList
        data={rewardsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      {/* Rewards Menu Option
      <View style={styles.rewardOptions}>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Get Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Get Gift Card</Text>
        </TouchableOpacity>
      </View>
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    backgroundColor: '#4CAF50', // Green color
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 5,
  },
  rewardOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  optionButton: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
  },
  rewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
  },
  rewardButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  rewardButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Rewards;