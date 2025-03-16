import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { PaymentProvider } from './context/PaymentContext';
import { StripeProviderComponent } from './context/StripeProvider';
// Auth Screens
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';

// Main App Screens
import BottomTabNavigator from './navigation/BottomTabNavigator';
import EditProfileScreen from './components/EditProfileScreen';
import ShippingAddressScreen from './components/ShippingAddressScreen';
import ChangePasswordScreen from './components/ChangePasswordScreen';
import CartScreen from './components/CartScreen';

const Stack = createNativeStackNavigator();

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

// Main Stack Navigator (includes Bottom Tab Navigator and other screens)
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="ShippingAddress" component={ShippingAddressScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <StripeProviderComponent>
        <PaymentProvider>
        <CartProvider>
        <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{ headerShown: false }}
            initialRouteName="Auth"
          >
            <Stack.Screen name="Auth" component={AuthStack} />
            <Stack.Screen name="Main" component={MainStack} />
          </Stack.Navigator>
        </NavigationContainer>
        </CartProvider>
          </PaymentProvider>
          </StripeProviderComponent>
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
