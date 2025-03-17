"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentOrder, setCurrentOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:9999/api/payment/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });  
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <OrderContext.Provider value={{ orders, loading, currentOrder, setCurrentOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => React.useContext(OrderContext);