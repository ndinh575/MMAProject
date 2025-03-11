"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useProduct } from "@/context/ProductContext";
import { Card, Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
const ProductDetail = () => {
    const router = useRouter();
    const { currentProduct } = useProduct();

    if (!currentProduct) {
        return (
            <Container className="text-center mt-5">
                <h4>Product not found</h4>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col md={2}>
                    <Button onClick={() => router.push("/")} variant="primary">Back</Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow">
                        <Card.Img variant="top" src={currentProduct.image_url} alt={currentProduct.name} style={{ height: "300px", objectFit: "cover" }} />
                        <Card.Body>
                            <Card.Title className="fw-bold">{currentProduct.name}</Card.Title>
                            <Card.Text>{currentProduct.description}</Card.Text>
                            <hr />
                            <p><strong>Cost Price:</strong> ${currentProduct.cost_price}</p>
                            <p><strong>Selling Price:</strong> ${currentProduct.selling_price}</p>
                            <p><strong>Stock Quantity:</strong> {currentProduct.stock_quantity}</p>
                            <p><strong>Category:</strong> {currentProduct.category}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetail;
