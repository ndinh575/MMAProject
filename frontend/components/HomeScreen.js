import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const {logout } = useContext(UserContext);
    const navigation = useNavigation();
  const handleLogout = () =>{
    logout();
    navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
    });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Home</Text>

      <>
          <Text>Welcome!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;