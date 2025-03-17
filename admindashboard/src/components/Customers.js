"use client";
import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Pagination, Form, Button, Modal } from "react-bootstrap";
import { useCustomer } from "@/context/CustomerContext";

// Constants
const CUSTOMERS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

// Utility functions
const formatDate = (createdDate) => {
    const date = new Date(createdDate);
    return date.toISOString().split('T')[0];
};

const calculatePagination = (customers, currentPage, customersPerPage) => {
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(customers.length / customersPerPage);

    return { currentCustomers, totalPages };
};

// Table Components
const CustomerTableHeader = () => (
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th></th>
            <th></th>
        </tr>
    </thead>
);

const CustomerTableRow = ({ customer, index, onShowDetail }) => (
    <tr>
        <td>{index + 1}</td>
        <td>{customer.name}</td>
        <td>{customer.email}</td>
        <td>{customer.phoneNumber}</td>
        <td>{customer.address.region}</td>
        <td>{formatDate(customer.dob)}</td>
        <td>{customer.gender}</td>
        <td><Button variant="primary" onClick={() => onShowDetail(customer)}>Detail</Button></td>
        <td><Button variant="danger">Delete</Button></td>
    </tr>
);

const CustomerDetailModal = ({ show, onHide, customer }) => (
    <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {customer && (
                <div>
                    <Row>
                        <Col md={4}>
                            <img 
                                src={customer.avatar} 
                                alt={customer.name}
                                style={{ width: '100%', height: 'auto', borderRadius: '50%' }}
                            />
                        </Col>
                        <Col md={8}>
                            <h4>{customer.name}</h4>
                            <p><strong>Email:</strong> {customer.email}</p>
                            <p><strong>Phone:</strong> {customer.phoneNumber}</p>
                            <p><strong>Gender:</strong> {customer.gender}</p>
                            <p><strong>Date of Birth:</strong> {formatDate(customer.dob)}</p>
                            <p><strong>Address:</strong></p>
                            <ul>
                                <li>Region: {customer.address.region}</li>
                                <li>Subregion: {customer.address.subregion}</li>
                                <li>Country: {customer.address.country}</li>
                                <li>Full Address: {customer.address.formattedAddress}</li>
                            </ul>
                            <p><strong>Member Since:</strong> {formatDate(customer.createdDate)}</p>
                        </Col>
                    </Row>
                </div>
            )}
        </Modal.Body>
    </Modal>
);

const CustomerTable = ({ customers, customersPerPage, setCustomersPerPage, currentPage, setCurrentPage }) => {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const { currentCustomers, totalPages } = calculatePagination(customers, currentPage, customersPerPage);

    const handleShowDetail = (customer) => {
        setSelectedCustomer(customer);
        setShowDetailModal(true);
    };

    return (
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
                                setCurrentPage(1);
                            }}
                        >
                            {CUSTOMERS_PER_PAGE_OPTIONS.map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
            </Form.Group>

            <Table striped bordered hover responsive>
                <CustomerTableHeader />
                <tbody>
                    {currentCustomers.map((customer, index) => (
                        <CustomerTableRow 
                            key={customer._id} 
                            customer={customer} 
                            index={index}
                            onShowDetail={handleShowDetail}
                        />
                    ))}
                </tbody>
            </Table>

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

            <CustomerDetailModal 
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                customer={selectedCustomer}
            />
        </Card>
    );
};

const Customers = () => {
    const { customers, loading } = useCustomer();
    const [currentPage, setCurrentPage] = useState(1);
    const [customersPerPage, setCustomersPerPage] = useState(CUSTOMERS_PER_PAGE_OPTIONS[0]);

    if (loading) return <p>Loading customers...</p>;

    return (
        <Container fluid className="mt-4">
            <h4 className="mb-4">Customer Dashboard</h4>

            <Row className="mt-4">
                <CustomerTable
                    customers={customers}
                    customersPerPage={customersPerPage}
                    setCustomersPerPage={setCustomersPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </Row>
        </Container>
    );
};

export default Customers;
