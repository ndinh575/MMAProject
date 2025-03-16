require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const connectDB = require('./config/db');

// Constants
const PORT = process.env.PORT || 9999;
const PAYLOAD_LIMIT = "10mb";

// Route imports 
const routes = {
  auth: require('./routes/auth'),
  protected: require('./routes/protectedRoute'),
  products: require('./routes/productRoute'),
  payment: require('./routes/paymentRoute'),
};

// Initialize express app
const app = express();

// Configure middleware
const configureMiddleware = (app) => {
  app.use(express.json({ limit: PAYLOAD_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: PAYLOAD_LIMIT }));
  app.use(cookieParser());
  app.use(cors({
    origin: true,
    credentials: true
  }));
};

// Configure routes
const configureRoutes = (app) => {
  app.use('/api/auth', routes.auth);
  app.use('/api/protected', routes.protected);
  app.use('/api/products', routes.products);
  app.use('/api/payment', routes.payment);
};

// Initialize server
const startServer = async () => {
  try {
    await connectDB();
    configureMiddleware(app);
    configureRoutes(app);
    
    app.listen(PORT, () => 
      console.log(`Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();