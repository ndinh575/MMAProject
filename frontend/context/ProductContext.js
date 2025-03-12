import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


export const ProductContext = createContext();

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

    return (
        <ProductContext.Provider value={{ products, loading, currentProduct, setCurrentProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
