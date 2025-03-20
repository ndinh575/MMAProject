import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { CartContext } from '../context/CartContext';
import { usePayment } from '../context/PaymentContext';
import { useStripe } from "@stripe/stripe-react-native";
import { UserContext } from '../context/UserContext';
import { ProductContext } from '../context/ProductContext';
const CartScreen = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const { cart, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
    const [loading, setLoading] = useState(false);
    const { fetchPaymentIntent, confirmPayment } = usePayment();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { fetchProducts } = useContext(ProductContext);

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.selling_price * item.quantity), 0);
    };

    const handleQuantityChange = (itemId, newQuantity, stockQuantity) => {
        if (newQuantity < 1) {
            Alert.alert(
                'Remove Item',
                'Do you want to remove this item from cart?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => updateQuantity(itemId, 1)
                    },
                    {
                        text: 'Remove',
                        style: 'destructive',
                        onPress: () => removeFromCart(itemId)
                    }
                ]
            );
            return;
        }

        if (newQuantity > stockQuantity) {
            Alert.alert('Stock Limit', `Only ${stockQuantity} items available`);
            return;
        }

        updateQuantity(itemId, newQuantity);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            Alert.alert('Empty Cart', 'Please add items to your cart before checking out.');
            return;
        }

        if(!user.address.formattedAddress){
            Alert.alert('No shipping address', 'Please update shipping address in profile tab');
            return;
        }
        setLoading(true);
        try {
            // Prepare cart details
            const orderData = {
                userId: user._id,
                products: cart.map(item => ({
                    id: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.selling_price,
                    total: item.selling_price * item.quantity,
                })),
                totalAmount: calculateTotal(),
                shippingAddress: user.address.formattedAddress,
            };
    
            // Send order details to backend using Axios
            const response = await fetchPaymentIntent(orderData);
    
            const { clientSecret, orderId } = response;
    
            if (!clientSecret) {
                setLoading(false);
                Alert.alert("Error", "Failed to create payment session.");
                return;
            }
    
            // Initialize Payment Sheet
            const { error } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Heal Tea',
            });
    
            if (error) {
                setLoading(false);
                Alert.alert("Error", error.message);
                return;
            }
    
            // Show Payment Sheet
            const { error: paymentError } = await presentPaymentSheet();
    
            if (paymentError) {
                Alert.alert("Payment Failed", paymentError.message);
            } else {
                Alert.alert("Success", "Payment completed successfully!");
    
                // Confirm order in backend
                await confirmPayment(orderId);
    
                // Clear cart after successful checkout
                clearCart();

                fetchProducts();
                
                navigation.navigate('Orders');
            }
        } catch (error) {
            Alert.alert("Checkout Error", error.response?.data?.error || error.message);
        }
    
        setLoading(false);
    };

    const renderEmptyCart = () => (
        <View style={styles.emptyCartContainer}>
            <Icon name="cart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <Button
                title="Start Shopping"
                onPress={() => navigation.navigate('Home')}
                containerStyle={styles.startShoppingButton}
                buttonStyle={styles.primaryButton}
            />
        </View>
    );

    const renderCartItem = (item) => (
        <View key={item._id} style={styles.cartItem}>
            <Image
                source={{ uri: item.image_url }}
                style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.selling_price)}
                </Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        onPress={() => handleQuantityChange(item._id, item.quantity - 1, item.stock_quantity)}
                        style={styles.quantityButton}
                    >
                        <Icon name="remove" size={20} color="#007bff" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => handleQuantityChange(item._id, item.quantity + 1, item.stock_quantity)}
                        style={styles.quantityButton}
                    >
                        <Icon name="add" size={20} color="#007bff" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => removeFromCart(item._id)}
                style={styles.removeButton}
            >
                <Icon name="trash-outline" size={24} color="#ff3b30" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Shopping Cart</Text>
            </View>
            
            {cart.length === 0 ? (
                renderEmptyCart()
            ) : (
                <>
                    <ScrollView style={styles.cartList}>
                        {cart.map(renderCartItem)}
                    </ScrollView>
                    <View style={styles.footer}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalLabel}>Total:</Text>
                            <Text style={styles.totalAmount}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
                            </Text>
                        </View>
                        <View style={styles.actionButtons}>
                            <Button
                                title="Clear Cart"
                                type="outline"
                                onPress={() => {
                                    Alert.alert(
                                        'Clear Cart',
                                        'Are you sure you want to remove all items?',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            { 
                                                text: 'Clear',
                                                style: 'destructive',
                                                onPress: clearCart
                                            }
                                        ]
                                    );
                                }}
                                containerStyle={styles.clearButton}
                                buttonStyle={styles.outlineButton}
                            />
                            <Button
                                title="Checkout"
                                onPress={handleCheckout}
                                loading={loading}
                                containerStyle={styles.checkoutButton}
                                buttonStyle={styles.primaryButton}
                            />
                        </View>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center'
    },
    cartList: {
        flex: 1,
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyCartText: {
        fontSize: 18,
        color: '#666',
        marginTop: 10,
        marginBottom: 20,
    },
    startShoppingButton: {
        width: '80%',
        marginTop: 20,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginTop: 15,
        padding: 15,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    itemPrice: {
        fontSize: 16,
        color: '#007bff',
        fontWeight: '600',
        marginBottom: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 15,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        padding: 5,
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    totalLabel: {
        fontSize: 18,
        color: '#333',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007bff',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    clearButton: {
        flex: 1,
        marginRight: 10,
    },
    checkoutButton: {
        flex: 2,
    },
    primaryButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        paddingVertical: 12,
    },
    outlineButton: {
        borderColor: '#007bff',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
    },
});

export default CartScreen;