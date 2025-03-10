"use client";
import React, { useState } from "react";
import { Row, Col, Card, Table, Form, Button } from "react-bootstrap";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useProduct } from "@/context/ProductContext";

const Products = () => {
    const router = useRouter();
    const { products, loading } = useProduct();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const categories = [...new Set(products.map(p => p.category))];
    const data = [
        { month: "Jan", sales: 400, stock: 2400 },
        { month: "Feb", sales: 300, stock: 2210 },
        { month: "Mar", sales: 500, stock: 2290 },
        { month: "Apr", sales: 700, stock: 2000 },
        { month: "May", sales: 600, stock: 2181 },
        { month: "Jun", sales: 800, stock: 2500 },
    ];

    if (loading) return <p>Loading products...</p>;
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
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Button variant="primary" onClick={() => router.push("/addproduct")}>
                        <FaPlus /> Add Product
                    </Button>
                </Col>
            </Row>
            <Row>
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Cost Price</th>
                        <th>Selling Price</th>
                        <th>Quantity</th>
                        <th>Total Sales</th>
                        <th>Profit</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products
                        .filter((product) =>
                            product.name.toLowerCase().includes(search.toLowerCase())
                        )
                        .filter((product) => (filter ? product.category === filter : true))
                        .map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.cost_price + ' VND'}</td>
                                <td>{product.selling_price + ' VND'}</td>
                                <td>{product.stock_quantity}</td>
                                <td></td>
                                <td></td>
                                <td>
                                    <Button variant="primary me-3">Detail</Button>
                                    <Button variant="warning me-3">Edit</Button>
                                    <Button variant="danger me-3">Delete</Button>
                                </td>

                            </tr>
                        ))}
                </tbody>
            </Table>
            </Row>
        </div>
    );
};

export default Products;
