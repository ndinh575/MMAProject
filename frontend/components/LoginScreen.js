import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigation } from '@react-navigation/native';
import { View, TextInput, Button, Text, StyleSheet, Alert, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const LoginScreen = () => {
    const { login } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!username || !password) {
            setError('Validation Error', 'Please enter both username and password');
            return;
        }

        setLoading(true);

        try {
            const response = await login(username, password);
            if(response){
                setError(null)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            }else{
                setError('Invalid credentials or server error');
            }
        } catch (error) {
            setError('Invalid credentials or server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
            />

            <Text>
                {error && <Text style={{ color: 'red' }}>{error}</Text>}
            </Text>

            <Button
                title={loading ? 'Logging in...' : 'Login'}
                onPress={handleLogin}
                disabled={loading}
            />

            {loading && <Text>Loading...</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    input: {
        width: width > 768 ? '30%' : '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 10,
        borderRadius: 5,
    },
});

export default LoginScreen;