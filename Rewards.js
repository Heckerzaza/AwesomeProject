import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const Rewards = () => {
    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Rewards</Text>
            </View>

            {/* Available Points */}
            <View style={styles.pointsContainer}>
                <Text style={styles.pointsText}>Available Points:</Text>
                <Text style={styles.pointsValue}>150</Text>
            </View>

            {/* Reward Options */}
            <View style={styles.rewardsContainer}>
                <Text style={styles.rewardsTitle}>Redeem Your Points</Text>

                {/* Reward Item 1 */}
                <View style={styles.rewardItem}>
                    <Image
                        style={styles.rewardImage}
                        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your image URL
                    />
                    <View style={styles.rewardDetails}>
                        <Text style={styles.rewardName}>Coffee Voucher</Text>
                        <Text style={styles.rewardDescription}>Enjoy a free coffee!</Text>
                        <Text style={styles.rewardPoints}>50 Points</Text>
                    </View>
                </View>

                {/* Reward Item 2 */}
                <View style={styles.rewardItem}>
                    <Image
                        style={styles.rewardImage}
                        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your image URL
                    />
                    <View style={styles.rewardDetails}>
                        <Text style={styles.rewardName}>Movie Ticket</Text>
                        <Text style={styles.rewardDescription}>Watch a movie on us!</Text>
                        <Text style={styles.rewardPoints}>100 Points</Text>
                    </View>
                </View>

                {/* Add more reward items as needed */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    header: {
        backgroundColor: '#3498db',
        padding: 20,
        alignItems: 'center',
    },
    headerText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    pointsContainer: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    pointsText: {
        fontSize: 18,
    },
    pointsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#27ae60',
    },
    rewardsContainer: {
        marginVertical: 10,
    },
    rewardsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    rewardItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    rewardImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    rewardDetails: {
        flex: 1,
    },
    rewardName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rewardDescription: {
        fontSize: 14,
        color: 'gray',
        marginVertical: 5,
    },
    rewardPoints: {
        fontSize: 16,
        color: '#e74c3c',
    },
});

export default Rewards;