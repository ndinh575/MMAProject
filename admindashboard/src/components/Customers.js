"use client";
import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Pagination, Form, Button } from "react-bootstrap";
import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { useCustomer } from "@/context/CustomerContext";

const data = [
    { month: "Jan", retained: 90, churned: 10 },
    { month: "Feb", retained: 85, churned: 15 },
    { month: "Mar", retained: 80, churned: 20 },
    { month: "Apr", retained: 78, churned: 22 },
    { month: "May", retained: 75, churned: 25 },
    { month: "Jun", retained: 72, churned: 28 },
];

const ordersData = [
    { month: "Jan", orders: 120 },
    { month: "Feb", orders: 150 },
    { month: "Mar", orders: 180 },
    { month: "Apr", orders: 200 },
    { month: "May", orders: 220 },
];

export default function Customers() {

    const { customers, loading } = useCustomer();

    if (loading) return <p>Loading customers...</p>;

    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage, setCustomersPerPage] = useState(5);
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const totalPages = Math.ceil(customers.length / customersPerPage);

    const handeDate = (createdDate) => {
        const date = new Date(createdDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
        const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day
        return `${year}-${month}-${day}`;
    }


    return (
        <Container fluid className="mt-4">
            <h4 className="mb-4">Customer Dashboard</h4>

            {/* Charts Section */}
            <Row>
                {/* Customer Orders (Bar Chart) */}
                <Col md={6}>
                    <Card className="p-3 shadow-sm">
                        <h5>Customer Orders & Activity</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ordersData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="orders" fill="#007bff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow-sm p-3">
                        <h5 className="text-center mb-3">Customer Retention & Churn</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={data}>
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="retained" fill="#4CAF50" stroke="#388E3C" name="Retained Customers" />
                                <Area type="monotone" dataKey="churned" fill="#F44336" stroke="#D32F2F" name="Churned Customers" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Customer Table */}
            <Row className="mt-4">
                <Card className="shadow-sm p-3">
                    <Card.Title>Customer List</Card.Title>

                    <Form.Group className="mb-3">
                        <Row>
                            <Col md={1}>
                                <Form.Label>Customer per page:</Form.Label>
                            </Col>
                            <Col md={1}>
                                <Form.Select
                                    value={customersPerPage}
                                    onChange={(e) => {
                                        setCustomersPerPage(Number(e.target.value));
                                        setCurrentPage(1); // Reset to first page
                                    }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </Form.Select>
                            </Col>
                        </Row>


                    </Form.Group>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Address</th>
                                <th>Created Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCustomers.map((customer, index) => (
                                <tr key={index}>
                                    <td>{customer.id}</td>
                                    <td>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phoneNumber}</td>
                                    <td>{customer.address}</td>
                                    <td>{handeDate(customer.createdDate)}</td>
                                    <td><Button variant="primary">Detail</Button></td>
                                    <td><Button variant="danger">Delete</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>


                    {/* Pagination */}
                    <Pagination className="justify-content-center">
                        <Pagination.Prev
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        />
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === currentPage}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </Card>
            </Row>
        </Container>
    );
}
