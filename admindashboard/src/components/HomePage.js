"use client";
import React, { useState } from "react";

import { Container, Navbar, Nav, Row, Col, Card, Button, Dropdown, Badge } from "react-bootstrap";
import { FaBars, FaTachometerAlt, FaShoppingCart, FaUsers, FaChartLine, FaBell, FaUserCircle, FaBox } from "react-icons/fa";
import DashBoard from "./DashBoard";
import Orders from "./Orders";
import Customers from "./Customers";
import Products from "./Products";
import Header from "./Header";
import Sidebar from "./SideBar";

export default function HomePage() {

    const [selectedItem, setSelectedItem] = useState("Dashboard");
    return (
        <div className="d-flex">
            {/* Sidebar */}
            <Sidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>

            {/* Main Content */}
            <div className="main-content flex-grow-1">
                {/* Header */}
                <Header/>

                {/* Dashboard Content */}
                {selectedItem==="Dashboard" &&  <DashBoard/>}

                {selectedItem==="Orders" &&  <Orders/>}

                {selectedItem==="Customers" &&  <Customers/>}

                {selectedItem==="Products" &&  <Products/>}
            </div>


        </div>
    );
}
