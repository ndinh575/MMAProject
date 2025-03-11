"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentProduct, setCurrentProduct] = useState(null);

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

    useEffect(() => {
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
            fetchProducts();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const deleteProduct = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:9999/api/products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in Authorization header
                },
            });
            console.log("Product deleted successfully");
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }; 

    const updateProduct = async (productId, productData) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:9999/api/products/${productId}`, productData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in Authorization header
                    "Content-Type": "application/json",
                },
            });
            fetchProducts();
            console.log("Product updated successfully");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };  

    return (
        <ProductContext.Provider value={{ products, loading, addProduct, deleteProduct, updateProduct, currentProduct, setCurrentProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => React.useContext(ProductContext);