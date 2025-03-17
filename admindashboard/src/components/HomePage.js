"use client";
import React, { useState, useEffect, useCallback } from "react";

import { Container, Navbar, Nav, Row, Col, Card, Button, Dropdown, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUsers, FaBox } from "react-icons/fa";
import Orders from "./Orders";
import Customers from "./Customers";
import Products from "./Products";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";
import { useCommon } from "@/context/CommonContext";
export default function HomePage() {
    const { selectedItem, setSelectedItem } = useCommon();
    const router = useRouter();
    const { verifyToken } = useCustomer();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const verifiedUser = await verifyToken();
            if (!verifiedUser) {
                router.push("/login"); // Redirect to login if not authenticated
            } else {
                setLoading(false); // Allow rendering only when authenticated
            }
        };

        checkAuth();
    }, []);

    if (loading) return null;

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />

            {/* Main Content */}
            <div className="main-content flex-grow-1">
                {/* Header */}
                <Header />

                {selectedItem === "Orders" && <Orders />}

                {selectedItem === "Customers" && <Customers />}

                {selectedItem === "Products" && <Products />}
            </div>


        </div>
    );
}
