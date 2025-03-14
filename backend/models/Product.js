const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    cost_price: { type: Number, required: true },
    selling_price: { type: Number, required: true },
    stock_quantity: { type: Number, required: true },
    image_url: { type: String }, 
    category: { type: String, required: true },
    expiry: { type: String },
    origin: { type: String },
    sendFrom: { type: String },
    weight: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
