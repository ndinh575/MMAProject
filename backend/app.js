require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoute');
const productRoutes = require('./routes/productRoute');
// Các route khác
const app = express();

// Cấu hình Express
app.use(express.json({ limit: "10mb" })); // Handles JSON, including Base64 images
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Handles URL-encoded form data


app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true, // Allow cookies and authorization headers
  })
);

// MongoDB connection
connectDB();
app.use(cookieParser());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/products', productRoutes);

// Start server
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));