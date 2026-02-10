// XeriaCo Public Cart API Gateway
// Makes cart API accessible to frontend from internet
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

// Enhanced CORS for production
app.use(cors({
  origin: [
    'https://xeriaco-frontend-production.up.railway.app',
    'https://xeriacofinal.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Health check for the gateway
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'XeriaCo Public Cart Gateway',
    timestamp: new Date().toISOString(),
    endpoints: {
      cart: '/api/cart/:sessionId',
      addToCart: '/api/cart/add',
      updateCart: '/api/cart/update',
      removeFromCart: '/api/cart/remove',
      checkout: '/api/checkout'
    }
  });
});

// Proxy all /api/cart* and /api/checkout requests to local cart API
app.use('/api/cart', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/cart': '/api/cart'
  },
  onError: (err, req, res) => {
    console.error('Cart API Proxy Error:', err);
    res.status(500).json({
      error: 'Cart service temporarily unavailable',
      message: err.message
    });
  }
}));

app.use('/api/checkout', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/checkout': '/api/checkout'
  }
}));

// Fallback for products API - proxy to original backend
app.use('/api/products', createProxyMiddleware({
  target: 'https://xeriaco-backend-production.up.railway.app',
  changeOrigin: true,
  pathRewrite: {
    '^/api/products': '/api/products'
  }
}));

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'XeriaCo Cart API',
    version: '1.0.0',
    description: 'Emergency cart and checkout functionality for XeriaCo store',
    endpoints: {
      'GET /api/cart/:sessionId': 'Get cart contents for session',
      'POST /api/cart/add': 'Add item to cart',
      'PUT /api/cart/update': 'Update cart item quantity',
      'DELETE /api/cart/remove': 'Remove item from cart',
      'POST /api/checkout': 'Process checkout and create order',
      'GET /api/products': 'Get product catalog (proxied to main backend)'
    },
    examples: {
      addToCart: {
        url: 'POST /api/cart/add',
        body: {
          sessionId: 'user_session_id',
          productId: 'product_id_from_catalog',
          quantity: 1,
          price: 99.99,
          title: 'Product Name',
          image: 'https://example.com/image.jpg'
        }
      },
      checkout: {
        url: 'POST /api/checkout',
        body: {
          sessionId: 'user_session_id',
          customerEmail: 'customer@example.com',
          customerName: 'Customer Name',
          shippingAddress: {
            street: '123 Main St',
            city: 'City',
            zip: '12345'
          },
          paymentMethod: 'credit_card'
        }
      }
    }
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 XeriaCo Public Cart Gateway running on port ${PORT}`);
  console.log(`📡 Accessible at: http://0.0.0.0:${PORT}`);
  console.log(`🛍️ Cart API: http://0.0.0.0:${PORT}/api/cart/*`);
  console.log(`💳 Checkout API: http://0.0.0.0:${PORT}/api/checkout`);
  console.log(`📋 Documentation: http://0.0.0.0:${PORT}/api/docs`);
  console.log(`❤️ Health check: http://0.0.0.0:${PORT}/health`);
});

module.exports = app;