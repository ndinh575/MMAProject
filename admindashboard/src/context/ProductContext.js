"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:9999/api/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addProduct = async (productData) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:9999/api/products", productData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in Authorization header
                    "Content-Type": "application/json",
                },
            });
            console.log("Product added successfully:", response.data);
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <ProductContext.Provider value={{ products, loading, addProduct}}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => React.useContext(ProductContext);