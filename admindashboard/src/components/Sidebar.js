"use client";
import React from "react";
import { Nav } from "react-bootstrap";
import {FaBox, FaShoppingCart, FaUsers } from "react-icons/fa";

const Sidebar = ({ selectedItem, setSelectedItem }) => {
    return (
        <div className={`sidebar bg-dark text-white`}>
                <div className="sidebar-header d-flex align-items-center justify-content-between p-3">
                    <h5 className="mb-0">Admin Panel</h5>
                </div>

                <Nav className="flex-column p-3 gap-4">
                    <Nav.Link href="#" className={`text-white ${selectedItem === "Orders" ? "bg-primary" : ""}`}
                        onClick={() => setSelectedItem("Orders")}>
                        <FaShoppingCart size={20} className="me-2" /> Orders
                    </Nav.Link>
                    <Nav.Link href="#" className={`text-white ${selectedItem === "Customers" ? "bg-primary" : ""}`}
                        onClick={() => setSelectedItem("Customers")}>
                        <FaUsers size={20} className="me-2" /> Customers
                    </Nav.Link>
                    <Nav.Link href="#" className={`text-white ${selectedItem === "Products" ? "bg-primary" : ""}`}
                        onClick={() => setSelectedItem("Products")}>
                        <FaBox size={20} className="me-2" /> Products
                    </Nav.Link>
                </Nav>
            </div>

            
    );
};

export default Sidebar ;