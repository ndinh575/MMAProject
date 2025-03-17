import { Modal, Table, Button } from "react-bootstrap";
import { useOrder } from "@/context/OrderContext";
export default function OrderDetailModal({ show, handleClose }) {
    const {currentOrder} = useOrder();

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {currentOrder && (
                    <>
                        <p><strong>Order ID:</strong> {currentOrder._id}</p>
                        <p><strong>User:</strong> {currentOrder.user?.name || "Unknown"}</p>
                        <p><strong>Total:</strong> {currentOrder.total} VND</p>
                        <p><strong>Status:</strong> {currentOrder.status}</p>
                        <p><strong>Shipping Address:</strong> {currentOrder.shipping_address}</p>
                        <p><strong>Order Date:</strong> {new Date(currentOrder.order_date).toLocaleString()}</p>

                        <h5>Products</h5>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrder.products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.id.name || "Unknown Product"}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.price} VND</td>
                                        <td>{product.total} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                    )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
