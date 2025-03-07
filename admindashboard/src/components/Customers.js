"use client";
import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Pagination } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, AreaChart, Area } from "recharts";

const customerData = [
    { name: "Active", value: 400 },
    { name: "Inactive", value: 200 },
    { name: "New", value: 150 },
];

const COLORS = ["#28a745", "#dc3545", "#007bff"];

const revenueData = [
    { month: "Jan", revenue: 1000 },
    { month: "Feb", revenue: 1200 },
    { month: "Mar", revenue: 1400 },
    { month: "Apr", revenue: 1300 },
    { month: "May", revenue: 1600 },
    { month: "Jun", revenue: 1800 },
];

const customers = [
    { id: "#101", name: "John Doe", email: "john@example.com", status: "Active", spend: "$1200" },
    { id: "#102", name: "Jane Smith", email: "jane@example.com", status: "Inactive", spend: "$800" },
    { id: "#103", name: "Mike Johnson", email: "mike@example.com", status: "New", spend: "$500" },
    { id: "#104", name: "Alice Brown", email: "alice@example.com", status: "Active", spend: "$1500" },
    { id: "#105", name: "David Lee", email: "david@example.com", status: "Inactive", spend: "$600" },
    { id: "#106", name: "Emma White", email: "emma@example.com", status: "New", spend: "$900" },
    { id: "#107", name: "Chris Green", email: "chris@example.com", status: "Active", spend: "$1100" },
    { id: "#108", name: "Robert Black", email: "robert@example.com", status: "Inactive", spend: "$700" },
    { id: "#109", name: "Sophia Blue", email: "sophia@example.com", status: "New", spend: "$450" },
    { id: "#110", name: "Liam Grey", email: "liam@example.com", status: "Active", spend: "$1350" },
];

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
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 5;

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const totalPages = Math.ceil(customers.length / customersPerPage);

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
                <Col md={12}>
                    <Card className="shadow-sm p-3">
                        <Card.Title>Customer List</Card.Title>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Total Spend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCustomers.map((customer, index) => (
                                    <tr key={index}>
                                        <td>{customer.id}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.email}</td>
                                        <td
                                            className={
                                                customer.status === "Active"
                                                    ? "text-success"
                                                    : customer.status === "New"
                                                        ? "text-primary"
                                                        : "text-danger"
                                            }
                                        >
                                            {customer.status}
                                        </td>
                                        <td>{customer.spend}</td>
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
                </Col>
            </Row>
        </Container>
    );
}
