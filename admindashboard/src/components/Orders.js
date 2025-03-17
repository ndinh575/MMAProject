"use client";
import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Pagination, Button } from "react-bootstrap";
import { useOrder } from "../context/OrderContext";
import OrderDetailModal from "./OrderDetailModal";  

export default function Orders() {
    const [currentPage, setCurrentPage] = useState(1);
    const { orders, currentOrder, setCurrentOrder } = useOrder();
    const [modalShow, setModalShow] = useState(false);
    const ordersPerPage = 5;

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    // Format price to currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

    return (
        <Container fluid className="mt-4">
            
            <Row>
                <Card className="shadow-sm p-3">
                    <Card.Title>Recent Orders</Card.Title>
                    <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user?.name || "Unknown"}</td>
                                <td>{formatCurrency(order.products.reduce((total, product) => total + product.price * product.quantity, 0))}</td>
                                <td>{order.status}</td>
                                <td>
                                <Button variant="primary" onClick={() => {setCurrentOrder(order); setModalShow(true);}}>View</Button>
                                </td>
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
            {/* Order Detail Modal */}
            <OrderDetailModal
                show={modalShow}
                handleClose={() => {setModalShow(false); setCurrentOrder(null);}}
            />
        </Container>
    );
}
