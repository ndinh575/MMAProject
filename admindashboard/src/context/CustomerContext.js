"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create Context
const CustomerContext = createContext();

// Provider Component
export const CustomerProvider = ({ children }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch customers from API
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get("http://localhost:9999/api/auth/users");
                setCustomers(response.data);
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    // Add a new customer
    const addCustomer = async (customerData) => {
        try {

            const response = await axios.post(
                "http://localhost:9999/api/auth/register",
                customerData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in Authorization header
                    },
                }
            );

            setCustomers([...customers, response.data]); // Update state with new customer
        } catch (error) {
            console.error("Error adding customer:", error);
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
    };
    

    // Update customer
    const updateCustomer = async (id, updatedData) => {
        try {

            await axios.put(
                `http://localhost:9999/api/auth/users/${id}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Send token in Authorization header
                    },
                }
            );

            setCustomers(customers.map((customer) =>
                customer._id === id ? { ...customer, ...updatedData } : customer
            ));
        } catch (error) {
            console.error("Error updating customer:", error);
        }
    };


    // Delete customer
    const deleteCustomer = async (id) => {
        try {
            const token = localStorage.getItem("token"); // Retrieve token from storage
    
            if (!token) {
                console.error("No token found. User not authenticated.");
                window.location.href = "/login";
                return; 
            }
    
            await axios.delete(`http://localhost:9999/api/auth/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in Authorization header
                },
            });
    
            setCustomers(customers.filter((customer) => customer._id !== id));
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };
    

    const login = async (email, password) => {
        try {
            // Send the POST request to the backend
            const response = await axios.post('http://localhost:9999/api/auth/login', { email, password });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token); // Store token
                return true; // Login successful
            } else {
                console.error("No token returned from the server");
                return false;
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem("token"); 
        window.location.href = "/login"; 

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CustomerContext.Provider value={{ customers, loading, addCustomer, updateCustomer, deleteCustomer, verifyToken, login, logout }}>
            {children}
        </CustomerContext.Provider>
    );
};

// Custom hook to use CustomerContext
export const useCustomer = () => React.useContext(CustomerContext);
