"use client";
import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Pagination } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const orderData = [
    { date: "Jan", orders: 120 },
    { date: "Feb", orders: 150 },
    { date: "Mar", orders: 200 },
    { date: "Apr", orders: 180 },
    { date: "May", orders: 250 },
    { date: "Jun", orders: 300 },
];

const salesData = [
    { month: "Jan", sales: 5000 },
    { month: "Feb", sales: 7000 },
    { month: "Mar", sales: 8000 },
    { month: "Apr", sales: 12000 },
    { month: "May", sales: 15000 },
    { month: "Jun", sales: 17000 },
    { month: "Jul", sales: 19000 },
    { month: "Aug", sales: 22000 },
    { month: "Sep", sales: 25000 },
    { month: "Oct", sales: 27000 },
    { month: "Nov", sales: 30000 },
    { month: "Dec", sales: 35000 },
  ];

const orders = [
    { id: "#1001", customer: "John Doe", status: "Completed", amount: "$120" },
    { id: "#1002", customer: "Jane Smith", status: "Pending", amount: "$75" },
    { id: "#1003", customer: "Mike Johnson", status: "Cancelled", amount: "$200" },
    { id: "#1004", customer: "Alice Brown", status: "Completed", amount: "$90" },
    { id: "#1005", customer: "David Lee", status: "Pending", amount: "$50" },
    { id: "#1006", customer: "Chris Green", status: "Completed", amount: "$130" },
    { id: "#1007", customer: "Emma White", status: "Cancelled", amount: "$250" },
    { id: "#1008", customer: "Robert Black", status: "Pending", amount: "$80" },
    { id: "#1009", customer: "Sophia Blue", status: "Completed", amount: "$110" },
    { id: "#1010", customer: "Liam Grey", status: "Pending", amount: "$60" },
];

export default function Orders() {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    return (
        <Container fluid className="mt-4">


            {/* Chart and Orders Table */}
            <Row>
                <Col md={6}>
                    <h4 className="mb-4">Orders Dashboard</h4>
                    <Card className="shadow-sm p-3">
                        <Card.Title>Orders Over Time</Card.Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={orderData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="orders" stroke="#007bff" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                <Col md={6}>
                    <h4 className="mb-4">Sales Overview</h4>
                    <Card className="shadow-sm p-3">
                        <Card.Title>Monthly Sales ($)</Card.Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                                <Line type="monotone" dataKey="sales" stroke="#28a745" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Card className="shadow-sm p-3">
                    <Card.Title>Recent Orders</Card.Title>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map((order, index) => (
                                <tr key={index}>
                                    <td>{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td
                                        className={
                                            order.status === "Completed"
                                                ? "text-success"
                                                : order.status === "Pending"
                                                    ? "text-warning"
                                                    : "text-danger"
                                        }
                                    >
                                        {order.status}
                                    </td>
                                    <td>{order.amount}</td>
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
