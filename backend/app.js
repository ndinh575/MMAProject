require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoute');
// Các route khác
const app = express();

// Cấu hình Express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
      origin: "http://localhost:3000", // Allow only frontend origin
      credentials: true, // Allow cookies and authentication headers
    })
  );

// MongoDB connection
connectDB();
app.use(cookieParser());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// Start server
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));