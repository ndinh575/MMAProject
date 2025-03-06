"use client";
import React from "react";
import { Badge, Dropdown, Nav, Navbar } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";

const Header = () => {
    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-sm px-3">
                <Navbar.Brand href="#">Dashboard</Navbar.Brand>
                <Nav className="ms-auto d-flex align-items-center">
                    {/* Notifications */}
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="light" className="border-0 position-relative">
                            <FaBell size={22} />
                            <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">3</Badge>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ width: "250px" }}>
                            <Dropdown.Header>Notifications</Dropdown.Header>
                            <Dropdown.Item>New order received</Dropdown.Item>
                            <Dropdown.Item>Low stock alert</Dropdown.Item>
                            <Dropdown.Item>New customer registered</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Profile Dropdown */}
                    <Dropdown align="end" className="ms-3">
                        <Dropdown.Toggle variant="light" className="border-0">
                            <FaUserCircle size={24} className="me-2" /> Admin
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>My Profile</Dropdown.Item>
                            <Dropdown.Item>Settings</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Navbar>
        </>
    );
};

export default Header;