const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
exports.createOrder = async (req, res) => {
    try {
        const { products, totalAmount, userId, shippingAddress } = req.body;

        const order = new Order({
            user: userId,
            products,
            shipping_address: shippingAddress,
            total: totalAmount,
        });

        for (const item of products) {
            const product = await Product.findById(item.id);

            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item.id}` });
            }

            if (product.stock_quantity < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for: ${product.name}` });
            }

            product.stock_quantity -= item.quantity;
            await product.save();
        }

        await order.save();

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'vnd',
            payment_method_types: ["card"],
        });

        res.status(201).json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
}

exports.confirmPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        await Order.findByIdAndUpdate(orderId, { status: "Completed" });
        res.json({ message: "Order confirmed" });
    } catch (error) {
        res.status(500).json({ error: "Failed to confirm order" });
    }
}

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to get orders" });
    }
}

exports.getOrderByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId })
            .populate('products.id', 'name image_url')
            .sort({ createdAt: -1 });
        res.json({ orders: orders });
    } catch (error) {
        res.status(500).json({ error: "Failed to get orders" });
    }
}

