const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./src/config');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

// Import middleware
const { errorHandler, requestLogger } = require('./src/middleware/auth');

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: '*'
}));
app.use(morgan('dev'));
app.use(requestLogger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Root and health check endpoints
app.get('/', (req, res) => {
  res.send('Unikart backend running');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is running',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    data: null
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
====================================
  Unikart Backend API
====================================
  Environment: ${config.environment}
  Port: ${PORT}
  Frontend URL: ${config.urls.frontend}
  Database: PostgreSQL RDS
  Auth: AWS Cognito
====================================
  Endpoints:
  - GET  /health                    - Health check
  - POST /api/auth/logout           - User logout
  - GET  /api/auth/verify           - Verify Cognito token
  - GET  /api/products              - Get all products
  - GET  /api/products/:id          - Get product details
  - POST /api/products               - Create product (admin/vendor)
  - PUT  /api/products/:id           - Update product (admin/vendor)
  - DELETE /api/products/:id         - Delete product (admin/vendor)
  - POST /api/orders                 - Create order
  - GET  /api/orders                 - Get user orders
  - GET  /api/orders/:id             - Get order details
  - PUT  /api/orders/:id/cancel      - Cancel order
  - PUT  /api/orders/:id/status      - Update order status (admin/vendor)
====================================
  `);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = app;
