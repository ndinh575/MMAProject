"use client";
import React from "react";
import { Container, Row, Col, Card, Table, ProgressBar } from "react-bootstrap";
import { FaUser, FaShoppingCart, FaDollarSign, FaChartLine } from "react-icons/fa";
import { useCustomer } from "@/context/CustomerContext";
export default function DashBoard() {

  const { customers } = useCustomer();

  return (
    <Container fluid className="mt-4">
      {/* Top Stats Cards */}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm text-center p-3">
            <FaShoppingCart size={30} className="text-warning mb-2" />
            <Card.Title>Orders</Card.Title>
            <Card.Text className="fs-4">3,450</Card.Text>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm text-center p-3">
            <FaDollarSign size={30} className="text-success mb-2" />
            <Card.Title>Revenue</Card.Title>
            <Card.Text className="fs-4">$45,000</Card.Text>
          </Card>
        </Col>
      </Row>

      {/* Order Statistics */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Order Statistics</Card.Title>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#1001</td>
                    <td>John Doe</td>
                    <td className="text-success">Completed</td>
                    <td>$120</td>
                  </tr>
                  <tr>
                    <td>#1002</td>
                    <td>Jane Smith</td>
                    <td className="text-warning">Pending</td>
                    <td>$75</td>
                  </tr>
                  <tr>
                    <td>#1003</td>
                    <td>Mike Johnson</td>
                    <td className="text-danger">Cancelled</td>
                    <td>$200</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Popular Products */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Popular Products</Card.Title>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Sales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>iPhone 15</td>
                    <td>Smartphones</td>
                    <td>500</td>
                  </tr>
                  <tr>
                    <td>MacBook Pro</td>
                    <td>Laptops</td>
                    <td>300</td>
                  </tr>
                  <tr>
                    <td>AirPods Pro</td>
                    <td>Accessories</td>
                    <td>700</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
