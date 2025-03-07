"use client";
import React from "react";
import { Badge, Dropdown, Nav, Navbar } from "react-bootstrap";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useCustomer } from "@/context/CustomerContext";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();
    const {logout} = useCustomer();
    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-sm px-3">
                <Navbar.Brand href="#">Dashboard</Navbar.Brand>
                <Nav className="ms-auto d-flex align-items-center">

                    {/* Profile Dropdown */}
                    <Dropdown align="end" className="ms-3">
                        <Dropdown.Toggle variant="light" className="border-0">
                            <FaUserCircle size={24} className="me-2" /> Admin
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Navbar>
        </>
    );
};

export default Header;