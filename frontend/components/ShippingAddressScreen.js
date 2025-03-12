import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';

const ShippingAddressScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser, loading } = useContext(UserContext);
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleUpdateAddress = async () => {
    try {
      await updateUser({ address });
      setIsEditing(false);
      Alert.alert('Success', 'Address updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update address');
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to get your address');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Get address from coordinates using reverse geocoding
      const [reverseGeocode] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode) {
        setAddress(prev => ({
          ...prev,
          street: reverseGeocode.street || '',
          city: reverseGeocode.city || '',
          state: reverseGeocode.region || '',
          zipCode: reverseGeocode.postalCode || '',
          country: reverseGeocode.country || '',
        }));
        setIsEditing(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSave = () => {
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    handleUpdateAddress();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shipping Address</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={getCurrentLocation}
          disabled={isLoadingLocation}
        >
          <Icon name="location" size={24} color="#007bff" />
          <Text style={styles.locationButtonText}>
            {isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}
          </Text>
        </TouchableOpacity>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={styles.input}
            value={address.street}
            onChangeText={(text) => setAddress(prev => ({ ...prev, street: text }))}
            placeholder="Enter street address"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={address.city}
            onChangeText={(text) => setAddress(prev => ({ ...prev, city: text }))}
            placeholder="Enter city"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>State/Province</Text>
          <TextInput
            style={styles.input}
            value={address.state}
            onChangeText={(text) => setAddress(prev => ({ ...prev, state: text }))}
            placeholder="Enter state/province"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ZIP/Postal Code</Text>
          <TextInput
            style={styles.input}
            value={address.zipCode}
            onChangeText={(text) => setAddress(prev => ({ ...prev, zipCode: text }))}
            placeholder="Enter ZIP/postal code"
            editable={isEditing}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={address.country}
            onChangeText={(text) => setAddress(prev => ({ ...prev, country: text }))}
            placeholder="Enter country"
            editable={isEditing}
          />
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Address</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 15,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007bff',
  },
  locationButtonText: {
    marginLeft: 10,
    color: '#007bff',
    fontSize: 16,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ShippingAddressScreen; 