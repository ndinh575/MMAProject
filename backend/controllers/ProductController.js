const Product = require("../models/Product");

const validateRequiredFields = (fields) => {
    const requiredFields = ['name', 'cost_price', 'selling_price', 'stock_quantity', 'category', 'image_url'];
    return requiredFields.filter(field => !fields[field]);
};

const createProductData = (data) => {
    const { 
        name, description, cost_price, selling_price, stock_quantity, 
        image_url, category, expiry, origin, sendFrom, weight 
    } = data;
            
    return {
        name,
        description,
        cost_price,
        selling_price,
        stock_quantity,
        image_url,
        category,
        expiry,
        origin,
        sendFrom,
        weight
    };
};

exports.createProduct = async (req, res) => {
    try {
        const missingFields = validateRequiredFields(req.body);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Missing required fields",
                fields: missingFields
            });
        }

        const productData = createProductData(req.body);
        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Product added successfully!",
            product: savedProduct
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
