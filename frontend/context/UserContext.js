import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const login = async (email, password) => {
        try {
            // Send the POST request to the backend
            const response = await axios.post('http://localhost:9999/api/auth/login', { email, password });
            
            // Extract the token from the response
            const token = response.data.token;
    
            if (token) {
                await AsyncStorage.setItem('token', token);
                console.log('Token saved in AsyncStorage!');
                return token;
            } else {
                console.error('No token returned from the server');
                return null;
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const verifyToken = async () => {
        try {
            const token = localStorage.getItem("token"); // Retrieve token from local storage
            if (!token) return false; // If no token, user is not authenticated
    
            const response = await axios.get("http://localhost:9999/api/auth/verify-token", {
                headers: { Authorization: `Bearer ${token}` }, // Attach token in headers
            });
    
            return response.data; // Assuming response contains user data
        } catch (error) {
            console.error("Error verifying token:", error);
            return false; // Return false if token is invalid/expired
        }
    }

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            console.log('Token removed from AsyncStorage');
          } catch (error) {
            console.error('Error removing token:', error);
          }
    };

    return (
        <UserContext.Provider value={{ login, logout }}>
            {children}
        </UserContext.Provider>
    );
}