import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load cart from storage on mount
    useEffect(() => {
        loadCart();
    }, []);

    // Save cart to storage whenever it changes
    useEffect(() => {
        if (!loading) {
            saveCart();
        }
    }, [cart]);

    const loadCart = async () => {
        try {
            const savedCart = await AsyncStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveCart = async () => {
        try {
            await AsyncStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    };

    const addToCart = (product) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item._id === product._id);
            
            if (existingItem) {
                return currentCart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...currentCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(currentCart => currentCart.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 0) return;

        setCart(currentCart =>
            currentCart.map(item =>
                item._id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartItemCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartItemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}; 