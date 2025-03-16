import React, { useContext } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { CartContext } from "../context/CartContext";
import { ProductContext } from "../context/ProductContext";

const ProductDetailScreen = () => {
    const navigation = useNavigation();
    const { addToCart } = useContext(CartContext);
    const { currentProduct, setCurrentProduct } = useContext(ProductContext);


    if (!currentProduct) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Product not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        setCurrentProduct(null);
                        navigation.goBack();
                    }}
                >
                    <Icon name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
            </View>
            <Image source={{ uri: currentProduct.image_url }} style={styles.productImage} />
            <View style={styles.detailsContainer}>
                <Text style={styles.productName}>{currentProduct.name}</Text>
                <Text style={styles.productPrice}>
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(currentProduct.selling_price)}
                </Text>
                <Text style={styles.productDescription}>{currentProduct.description}</Text>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}><Text style={styles.bold}>Category:</Text> {currentProduct.category}</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Stock:</Text> {currentProduct.stock_quantity} left</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Expiry:</Text> {currentProduct.expiry || "N/A"}</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Origin:</Text> {currentProduct.origin || "Unknown"}</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Ships From:</Text> {currentProduct.sendFrom || "Not specified"}</Text>
                    <Text style={styles.infoText}><Text style={styles.bold}>Weight:</Text> {currentProduct.weight || "N/A"}</Text>
                </View>

                <TouchableOpacity 
                    style={styles.addToCartButton} 
                    onPress={() => addToCart(currentProduct)}
                >
                    <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        backgroundColor: "#fff",
    },
    productImage: {
        width: "100%",
        height: 300,
        resizeMode: "cover",
    },
    detailsContainer: {
        padding: 15,
    },
    productName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    productPrice: {
        fontSize: 20,
        color: "#007bff",
        fontWeight: "600",
        marginVertical: 8,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        marginTop: 10,
        marginBottom: 20,
    },
    backButton: {
        position: "absolute",
        left: 15,
        top: 15,
        zIndex: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    placeholder: {
        width: 24,
    },

    productDescription: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
    },
    addToCartButton: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "600",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 18,
        color: "red",
    },
    infoContainer: {
        marginVertical: 10,
    },
    infoText: {
        fontSize: 16,
        color: "#444",
        marginBottom: 5,
    },
    bold: {
        fontWeight: "bold",
    },
});

export default ProductDetailScreen;
