import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user data when the app starts
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const response = await axios.get('http://192.168.137.1:9999/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post('http://192.168.137.1:9999/api/auth/login', { email, password });
            const token = response.data.token;

            if (token) {
                await AsyncStorage.setItem('token', token);
                await loadUserData();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userData) => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('No authentication token');

            const response = await axios.put(
                'http://192.168.137.1:9999/api/auth/update-profile',
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setUser(prevUser => ({
                ...prevUser,
                ...response.data
            }));
            return true;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.error('Error removing token:', error);
        }
    };

    const createUser = async (userData) => {
        try {
            setLoading(true);
            const response = await axios.post('http://192.168.137.1:9999/api/auth/register', userData);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const sendOTP = async (email) => {
        try {
            setLoading(true);
            const response = await axios.post('http://192.168.137.1:9999/api/auth/send-otp', { email });
            return response.data;
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            setLoading(true);
            const response = await axios.post('http://192.168.137.1:9999/api/auth/verify-otp', { email, otp });
            return response.data;
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <UserContext.Provider value={{
            login,
            logout,
            user,
            updateUser,
            loading,
            refreshUser: loadUserData,
            createUser,
            sendOTP,
            verifyOTP
        }}>
            {children}
        </UserContext.Provider>
    );
}