require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoute');
// Các route khác
const app = express();

// Cấu hình Express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// MongoDB connection
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

// Start server
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));