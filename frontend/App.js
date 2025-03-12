import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { UserProvider } from './context/UserContext';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import { ProductProvider } from './context/ProductContext';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import EditProfileScreen from './components/EditProfileScreen';
import ShippingAddressScreen from './components/ShippingAddressScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="Home" 
              component={BottomTabNavigator}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{
                headerShown: false
              }}
            />
            <Stack.Screen 
              name="ShippingAddress" 
              component={ShippingAddressScreen}
              options={{
                headerShown: false
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ProductProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
