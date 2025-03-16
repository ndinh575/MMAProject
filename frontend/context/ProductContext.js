import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentProduct, setCurrentProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://192.168.137.1:9999/api/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductById = async (productId) => {
        try {
            const response = await axios.get(`http://192.168.137.1:9999/api/products/${productId}`);
            setCurrentProduct(response.data);
        } catch (error) {
            console.error("Error fetching product:", error);    
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, loading, currentProduct, setCurrentProduct, fetchProducts, fetchProductById }}>
            {children}
        </ProductContext.Provider>
    );
};
