import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigation } from '@react-navigation/native';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const { login } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                // Navigate to Main stack and reset navigation history
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                });
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.heading}>Herbal Tea Shop</Text>
                <Text style={styles.subheading}>Welcome back!</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Icon name="mail-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#666"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        secureTextEntry
                        onChangeText={setPassword}
                        placeholderTextColor="#666"
                    />
                </View>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.loginButtonText}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={styles.forgotPasswordButton}
                >
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Don't have an account?</Text>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Register')}
                        style={styles.registerButton}
                    >
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    logoContainer: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 10,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subheading: {
        fontSize: 16,
        color: '#666',
    },
    formContainer: {
        flex: 0.6,
        paddingHorizontal: 30,
        paddingTop: 50,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',
        fontSize: 16,
    },
    errorText: {
        color: '#ff3333',
        marginBottom: 15,
        textAlign: 'center',
    },
    loginButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    loginButtonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        color: '#666',
        fontSize: 14,
        marginRight: 5,
    },
    registerButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    registerButtonText: {
        color: '#007bff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    forgotPasswordButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#007bff',
        fontSize: 14,
    },
});

export default LoginScreen;