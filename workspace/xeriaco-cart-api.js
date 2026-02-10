// XeriaCo Cart API Implementation
// Business Operations Director - Emergency Cart Functionality
// Creates missing /api/cart endpoints to restore sales capability

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory cart storage (for immediate deployment)
// In production, this would use Redis or database
const carts = new Map();

// Cart API Endpoints - Missing from backend

// GET /api/cart/:sessionId - Get cart contents
app.get('/api/cart/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const cart = carts.get(sessionId) || { items: [], total: 0 };
    res.json(cart);
});

// POST /api/cart/add - Add item to cart
app.post('/api/cart/add', (req, res) => {
    const { sessionId, productId, quantity = 1, price, title, image } = req.body;
    
    if (!sessionId || !productId) {
        return res.status(400).json({ error: 'sessionId and productId required' });
    }

    let cart = carts.get(sessionId) || { items: [], total: 0 };
    
    // Check if item already exists
    const existingItem = cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            productId,
            quantity,
            price: parseFloat(price),
            title,
            image,
            addedAt: new Date().toISOString()
        });
    }
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date().toISOString();
    
    carts.set(sessionId, cart);
    
    res.json({ 
        success: true, 
        cart,
        message: `${title} added to cart` 
    });
});

// PUT /api/cart/update - Update cart item quantity
app.put('/api/cart/update', (req, res) => {
    const { sessionId, productId, quantity } = req.body;
    
    if (!sessionId || !productId) {
        return res.status(400).json({ error: 'sessionId and productId required' });
    }
    
    let cart = carts.get(sessionId);
    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }
    
    const item = cart.items.find(item => item.productId === productId);
    if (!item) {
        return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
        // Remove item
        cart.items = cart.items.filter(item => item.productId !== productId);
    } else {
        item.quantity = quantity;
    }
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date().toISOString();
    
    carts.set(sessionId, cart);
    
    res.json({ 
        success: true, 
        cart,
        message: 'Cart updated' 
    });
});

// DELETE /api/cart/remove - Remove item from cart
app.delete('/api/cart/remove', (req, res) => {
    const { sessionId, productId } = req.body;
    
    if (!sessionId || !productId) {
        return res.status(400).json({ error: 'sessionId and productId required' });
    }
    
    let cart = carts.get(sessionId);
    if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.productId !== productId);
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date().toISOString();
    
    carts.set(sessionId, cart);
    
    res.json({ 
        success: true, 
        cart,
        message: 'Item removed from cart' 
    });
});

// POST /api/checkout - Process checkout
app.post('/api/checkout', (req, res) => {
    const { 
        sessionId, 
        customerEmail, 
        customerName, 
        shippingAddress,
        paymentMethod 
    } = req.body;
    
    if (!sessionId || !customerEmail) {
        return res.status(400).json({ error: 'sessionId and customerEmail required' });
    }
    
    const cart = carts.get(sessionId);
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Generate order ID
    const orderId = 'XER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    const order = {
        orderId,
        sessionId,
        customerEmail,
        customerName,
        shippingAddress,
        paymentMethod,
        items: [...cart.items],
        total: cart.total,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Clear cart after checkout
    carts.delete(sessionId);
    
    // In production, this would:
    // 1. Process payment via Stripe/PayPal
    // 2. Save order to database
    // 3. Send confirmation email
    // 4. Trigger fulfillment process
    
    res.json({ 
        success: true, 
        order,
        message: `Order ${orderId} created successfully`,
        nextSteps: ['Payment processing', 'Order confirmation email', 'Fulfillment']
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'XeriaCo Cart API',
        activeCarts: carts.size,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`XeriaCo Cart API running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET /api/cart/:sessionId`);
    console.log(`  POST /api/cart/add`);
    console.log(`  PUT /api/cart/update`);
    console.log(`  DELETE /api/cart/remove`);
    console.log(`  POST /api/checkout`);
    console.log(`  GET /health`);
});

module.exports = app;