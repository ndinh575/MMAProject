import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
    Image
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { UserContext } from "../context/UserContext";
import { usePayment } from "../context/PaymentContext";

const OrdersScreen = () => {
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    
    const { user } = useContext(UserContext); 
    const userId = user?._id || "123"; 

    const { getUserOrders } = usePayment();

    const shortenOrderId = (id) => id.slice(0, 4) + "..." + id.slice(-2);

    // Fetch orders from backend
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getUserOrders(userId);
            setUserOrders(response.orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            Alert.alert("Error", "Failed to load orders.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const toggleExpandOrder = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <TouchableOpacity onPress={() => toggleExpandOrder(item._id)}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>Order: {shortenOrderId(item._id)}</Text>
                    <Text style={[styles.status, getStatusStyle(item.status)]}>{item.status}</Text>
                </View>
                <Text style={styles.totalAmount}>Total: {formatCurrency(item.products.reduce((sum, p) => sum + p.total, 0))}</Text>
                <Text style={styles.date}>Ordered on: {new Date(item.order_date).toLocaleDateString()}</Text>
                <Text style={styles.address}>Shipping to: {item.shipping_address}</Text>
                <Icon
                    name={expandedOrderId === item._id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#555"
                    style={styles.expandIcon}
                />
            </TouchableOpacity>

            {expandedOrderId === item._id && (
                <View style={styles.orderDetails}>
                    {item.products.map((product, index) => (
                        <View key={index} style={styles.productItem}>
                            {product.id.image_url && (
                                <Image source={{ uri: product.id.image_url }} style={styles.productImage} />
                            )}
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.id.name}</Text>
                                <Text>Quantity: {product.quantity}</Text>
                                <Text>{formatCurrency(product.price)} each</Text>
                                <Text>{formatCurrency(product.total)} total</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Orders</Text>
            {userOrders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="cart-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>No orders found</Text>
                </View>
            ) : (
                <FlatList
                    data={userOrders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderOrderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}
        </View>
    );
};

// Format price to currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

// Return dynamic styles for order status
const getStatusStyle = (status) => {
    switch (status) {
        case "pending": return { color: "orange" };
        case "confirmed": return { color: "blue" };
        case "shipped": return { color: "purple" };
        case "delivered": return { color: "green" };
        case "cancelled": return { color: "red" };
        default: return { color: "#555" };
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 15,
    },
    orderCard: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    orderId: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    status: {
        fontSize: 14,
        fontWeight: "bold",
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: "600",
        color: "#007bff",
        marginTop: 5,
    },
    date: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    address: {
        fontSize: 14,
        color: "#777",
    },
    expandIcon: {
        alignSelf: "center",
        marginTop: 5,
    },
    orderDetails: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },
    productItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontWeight: "bold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        fontSize: 18,
        color: "#666",
        marginTop: 10,
    },
});

export default OrdersScreen;
