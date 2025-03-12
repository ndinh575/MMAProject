import React, { useContext, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { ProductContext } from '../context/ProductContext';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const { logout } = useContext(UserContext);
  const navigation = useNavigation();
  const { products, loading } = useContext(ProductContext);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  if (loading) return null;

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.selling_price} VND</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <View style={styles.bottomRow}>
          <Text style={[styles.stock, item.stock_quantity < 5 ? styles.lowStock : null]}>
            {item.stock_quantity === 0 ? 'Out of Stock' : 
             item.stock_quantity < 5 ? `Only ${item.stock_quantity} left!` : 
             `Stock: ${item.stock_quantity}`}
          </Text>
          <TouchableOpacity style={styles.addToCartButton}>
            <Icon name="add-circle-outline" size={24} color="#007bff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
          <Icon name="cart" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  cartButton: {
    padding: 8,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 8,
    lineHeight: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stock: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: '500',
  },
  lowStock: {
    color: "#f44336",
  },
  addToCartButton: {
    padding: 5,
  },
});

export default HomeScreen;