"use client";
import React, { useState } from "react";
import { Row, Col, Card, Table, Form, Button, Modal } from "react-bootstrap";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useProduct } from "@/context/ProductContext";

const Products = () => {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const { products, loading, deleteProduct, setCurrentProduct, currentProduct } = useProduct();
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");

    // Derived state
    const categories = [...new Set(products.map(p => p.category))];
    const filteredProducts = products
        .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
        .filter(product => filter ? product.category === filter : true);

    // Sample data for chart - could be moved to a separate file/API
    const chartData = [
        { month: "Jan", sales: 400, stock: 2400 },
        { month: "Feb", sales: 300, stock: 2210 },
        { month: "Mar", sales: 500, stock: 2290 },
        { month: "Apr", sales: 700, stock: 2000 },
        { month: "May", sales: 600, stock: 2181 },
        { month: "Jun", sales: 800, stock: 2500 },
    ];

    // Event handlers
    const handleEdit = (product) => {
        setCurrentProduct(product);
        router.push("/productform");
    };

    const handlePreview = (product) => {
        setCurrentProduct(product);
        setShowDetailModal(true);
    };

    const handleCreate = () => {
        setCurrentProduct(null);
        router.push("/productform");
    };

    const handleDeleteClick = (product) => {
        setCurrentProduct(product);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            if (!currentProduct) throw new Error("Product not found");
            await deleteProduct(currentProduct._id);
            setShowModal(false);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    // Components
    const ProductChart = () => (
        <Row className="mb-4">
            <Card className="p-3 shadow-sm">
                <h5 className="text-center">Product Sales & Stock Trends</h5>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
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
    );

    const SearchAndFilter = () => (
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
                <Button variant="primary" onClick={handleCreate}>
                    <FaPlus /> Add Product
                </Button>
            </Col>
        </Row>
    );

    const ProductTable = () => (
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product, index) => (
                        <tr key={product._id}>
                            <td>{index + 1}</td>
                            <td>{product.name}</td>
                            <td>{`${product.cost_price.toLocaleString()}₫`}</td>
                            <td>{`${product.selling_price.toLocaleString()}₫`}</td>
                            <td>{product.stock_quantity}</td>
                            <td></td>
                            <td></td>
                            <td>
                                <Button variant="primary me-3" onClick={() => handlePreview(product)}>Detail</Button>
                                <Button variant="warning me-3" onClick={() => handleEdit(product)}>Edit</Button>
                                <Button variant="danger me-3" onClick={() => handleDeleteClick(product)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Row>
    );

    const DeleteModal = () => (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete <strong>{currentProduct?.name}</strong>?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            </Modal.Footer>
        </Modal>
    );

    const DetailModal = () => (
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{currentProduct?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {currentProduct && (
                    <div>
                        <img 
                            src={currentProduct.image_url} 
                            alt={currentProduct.name}
                            style={{ width: '100%', height: '300px', objectFit: 'cover', marginBottom: '20px' }}
                        />
                        <p><strong>Description:</strong> {currentProduct.description}</p>
                        <p><strong>Cost Price:</strong> {currentProduct.cost_price.toLocaleString()}₫</p>
                        <p><strong>Selling Price:</strong> {currentProduct.selling_price.toLocaleString()}₫</p>
                        <p><strong>Stock Quantity:</strong> {currentProduct.stock_quantity}</p>
                        <p><strong>Category:</strong> {currentProduct.category}</p>
                        <p><strong>Expiry Date:</strong> {currentProduct.expiry}</p>
                        <p><strong>Origin:</strong> {currentProduct.origin}</p>
                        <p><strong>Send From:</strong> {currentProduct.sendFrom}</p>
                        <p><strong>Weight:</strong> {currentProduct.weight}</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );

    if (loading) return <p>Loading products...</p>;

    return (
        <div className="container mt-4">
            <h3 className="text-center mb-4">Products Dashboard</h3>
            <ProductChart />
            <SearchAndFilter />
            <ProductTable />
            <DeleteModal />
            <DetailModal />
        </div>
    );
};

export default Products;
