"use client";
import React, { useState, useEffect } from "react";
import { useProduct } from "@/context/ProductContext";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useCustomer } from "@/context/CustomerContext";
import { useRouter } from "next/navigation";

const INITIAL_PRODUCT_STATE = {
    name: "",
    description: "", 
    cost_price: "",
    selling_price: "",
    stock_quantity: "",
    image_url: "",
    category: "",
    expiry: "",
    origin: "",
    sendFrom: "",
    weight: ""
};

const ProductForm = () => {
    const router = useRouter();
    const { verifyToken } = useCustomer();
    const { addProduct, currentProduct, setCurrentProduct, updateProduct } = useProduct();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(INITIAL_PRODUCT_STATE);

    useEffect(() => {
        const initializeForm = async () => {
            const verifiedUser = await verifyToken();
            if (!verifiedUser) {
                router.push("/login");
                return;
            }
            
            if (currentProduct) {
                setProduct(currentProduct);
            }
            setLoading(false);
        };

        initializeForm();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setProduct(prev => ({
                ...prev,
                image_url: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setCurrentProduct(null);
        setProduct(INITIAL_PRODUCT_STATE);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentProduct) {
                await updateProduct(currentProduct._id, product);
            } else {
                await addProduct(product);
            }
            resetForm();
            router.push("/");
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    if (loading) return null;

    const renderFormField = (label, name, type = "text", as = "input") => (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                as={as}
                type={type}
                name={name}
                value={product[name]}
                onChange={handleChange}
                required
            />
        </Form.Group>
    );

    return (
        <Container className="mt-5">
            <Row>
                <Col md={2}>
                    <Button onClick={() => router.push("/")} variant="primary">Back</Button>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <Card className="p-4">
                        <h2 className="text-center mb-4">
                            {currentProduct ? "Update Product" : "Add Product"}
                        </h2>
                        <Form onSubmit={handleSubmit}>
                            {renderFormField("Product Name", "name")}
                            {renderFormField("Description", "description", "text", "textarea")}
                            {renderFormField("Cost Price", "cost_price", "number")}
                            {renderFormField("Selling Price", "selling_price", "number")}
                            {renderFormField("Stock Quantity", "stock_quantity", "number")}
                            {renderFormField("Category", "category")}
                            {renderFormField("Expiry", "expiry")}
                            {renderFormField("Origin", "origin")}
                            {renderFormField("Send From", "sendFrom")}
                            {renderFormField("Weight", "weight")}

                            <Form.Group className="mb-3">
                                <Form.Label>Upload Image</Form.Label>
                                <Form.Control 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                    required={!currentProduct} 
                                />
                            </Form.Group>

                            {product.image_url && (
                                <div className="mb-3 text-center">
                                    <img 
                                        src={product.image_url} 
                                        alt="Preview" 
                                        style={{ width: "100px", height: "100px", objectFit: "cover" }} 
                                    />
                                </div>
                            )}

                            <Button variant="primary" type="submit" className="w-100">
                                {currentProduct ? "Update Product" : "Add Product"}
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductForm;
