"use client";
import React, { useState, useEffect } from "react";
import { useProduct } from "@/context/ProductContext";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
const ProductForm = () => {
    const router = useRouter();
    const { addProduct, currentProduct, setCurrentProduct, updateProduct } = useProduct();
    const [product, setProduct] = useState({
        name: "",
        description: "",
        cost_price: "",
        selling_price: "",
        stock_quantity: "",
        image_url: "",
        category: ""
    });

    useEffect(() => {
        if (currentProduct) {
            setProduct(currentProduct);
        }
    }, []);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setProduct({ ...product, image_url: reader.result }); // Convert image to base64
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentProduct) {
                await updateProduct(currentProduct._id, product);
            } else {
                await addProduct(product);
            }
            setCurrentProduct(null);
            setProduct({
                name: "",
                description: "",
                cost_price: "",
                selling_price: "",
                stock_quantity: "",
                image_url: "",
                category: ""
            });
            router.push("/");
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={2}>
                    <Button onClick={() => router.push("/")} variant="primary">Back</Button>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2 className="text-center mb-4">{currentProduct ? "Update Product" : "Add Product"}</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control type="text" name="name" value={product.name} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" value={product.description} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cost Price</Form.Label>
                            <Form.Control type="number" name="cost_price" value={product.cost_price} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Selling Price</Form.Label>
                            <Form.Control type="number" name="selling_price" value={product.selling_price} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Stock Quantity</Form.Label>
                            <Form.Control type="number" name="stock_quantity" value={product.stock_quantity} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" name="category" value={product.category} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={handleImageUpload} required={!currentProduct} />
                        </Form.Group>

                        {product.image_url && (
                            <div className="mb-3 text-center">
                                <img src={product.image_url} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                            </div>
                        )}

                        <Button variant="primary" type="submit" className="w-100">
                            {currentProduct ? "Update Product" : "Add Product"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductForm;
