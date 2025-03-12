import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const OrdersScreen = () => {
  // Placeholder for orders data
  const orders = [];

  const renderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
      <Text style={styles.orderDate}>{item.date}</Text>
      <Text style={styles.orderTotal}>${item.total}</Text>
      <Text style={styles.orderStatus}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Orders</Text>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    marginTop: 8,
  },
  orderStatus: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
});

export default OrdersScreen; 