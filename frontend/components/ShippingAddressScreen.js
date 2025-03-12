import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const ShippingAddressScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser, loading } = useContext(UserContext);
  const [address, setAddress] = useState({
    formattedAddress: user?.address?.formattedAddress || '',
    subregion: user?.address?.subregion || '',
    region: user?.address?.region || '',
    country: user?.address?.country || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setHasLocationPermission(status === 'granted');
    if (status === 'granted') {
      getCurrentLocation();
    }
  };

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
      
      if (!hasLocationPermission) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to get your address');
          return;
        }
        setHasLocationPermission(true);
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      const { latitude, longitude } = location.coords;
      
      setRegion({
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });

      // Get detailed address from coordinates using reverse geocoding
      const [reverseGeocode] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode) {
        console.log('Geocoding result:', reverseGeocode);
        
        setAddress(prev => ({
          ...prev,
          formattedAddress: reverseGeocode.formattedAddress || '',
          subregion: reverseGeocode.subregion || '',
          region: reverseGeocode.region || '',
          country: reverseGeocode.country || '',
        }));
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleMapPress = async (event) => {
    if (!isEditing) return;
    
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setRegion({
      ...region,
      latitude,
      longitude,
    });

    try {
      const [reverseGeocode] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode) {
        setAddress(prev => ({
          ...prev,
          formattedAddress: reverseGeocode.formattedAddress || '',
          subregion: reverseGeocode.subregion || '',
          region: reverseGeocode.region || '',
          country: reverseGeocode.country || '',
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get address from selected location');
    }
  };

  const handleSave = () => {
    if (!address.formattedAddress || !address.region || !address.country) {
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
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              draggable={isEditing}
              onDragEnd={handleMapPress}
            />
          </MapView>
        </View>

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
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address.formattedAddress}
            onChangeText={(text) => setAddress(prev => ({ ...prev, formattedAddress: text }))}
            placeholder="Enter address"
            editable={isEditing}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Subregion</Text>
          <TextInput
            style={styles.input}
            value={address.subregion}
            onChangeText={(text) => setAddress(prev => ({ ...prev, subregion: text }))}
            placeholder="Enter subregion"
            editable={isEditing}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Region</Text>
          <TextInput
            style={styles.input}
            value={address.region}
            onChangeText={(text) => setAddress(prev => ({ ...prev, region: text }))}
            placeholder="Enter region"
            editable={isEditing}
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
  mapContainer: {
    height: 300,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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