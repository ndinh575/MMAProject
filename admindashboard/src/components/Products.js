"use client";
import React, { useState } from "react";
import { Row, Col, Card, Table, Form, Button } from "react-bootstrap";
import { FaSearch, FaPlus } from "react-icons/fa";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Products = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const products = [
        { id: 1, name: "Product A", category: "Electronics", price: "$199" },
        { id: 2, name: "Product B", category: "Clothing", price: "$49" },
        { id: 3, name: "Product C", category: "Home & Kitchen", price: "$29" },
    ];

    const data = [
        { month: "Jan", sales: 400, stock: 2400 },
        { month: "Feb", sales: 300, stock: 2210 },
        { month: "Mar", sales: 500, stock: 2290 },
        { month: "Apr", sales: 700, stock: 2000 },
        { month: "May", sales: 600, stock: 2181 },
        { month: "Jun", sales: 800, stock: 2500 },
    ];

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">Products Dashboard</h3>
            <Row className="mb-4">
                <Card className="p-3 shadow-sm">
                    <h5 className="text-center">Product Sales & Stock Trends</h5>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" />
                            <Line type="monotone" dataKey="stock" stroke="#82ca9d" name="Stock" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </Row>
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Col>
                <Col md={3}>
                    <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Button variant="primary">
                        <FaPlus /> Add Product
                    </Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {products
                        .filter((product) =>
                            product.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .filter((product) => (filter ? product.category === filter : true))
                        .map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.price}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Products;
