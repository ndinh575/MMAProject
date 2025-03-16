import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { Alert } from "react-native";


const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {

    const fetchPaymentIntent = async (orderData) => {
        try{
            const response = await axios.post('http://192.168.137.1:9999/api/payment/create-payment-intent', orderData);
            return response.data;
        }catch(error){
            console.error("Error creating payment intent:", error);
            Alert.alert("Error", "Failed to create payment intent.");
        }
    }

    const confirmPayment = async (orderId) => {
        try{
            const response = await axios.post(`http://192.168.137.1:9999/api/payment/confirm-payment/${orderId}`);
            return response.data;
        }catch(error){
            console.error("Error confirming payment:", error);
        }
    }
    const getUserOrders = async (userId) => {
        try{
            const response = await axios.get(`http://192.168.137.1:9999/api/payment/orders/${userId}`);
            return response.data;
        }catch(error){
            console.error("Error getting orders:", error);
        }
    }
    return (
        <PaymentContext.Provider value={{ fetchPaymentIntent, confirmPayment, getUserOrders}}>
            {children}
        </PaymentContext.Provider>
    );
};

// Custom Hook
export const usePayment = () => useContext(PaymentContext);
