// XeriaCO Simple Public Store - External Access Solution
const express = require('express');
const app = express();

// Enhanced setup for public access
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Store data
const store = { orders: [], revenue: 0, products: [] };

// Load products
const products = [
    { id: 1, name: 'Premium Wireless Headphones', price: 149.99, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
    { id: 2, name: 'Bluetooth Speaker', price: 99.99, img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1' },
    { id: 3, name: 'Wireless Charger', price: 69.99, img: 'https://images.unsplash.com/photo-1622782914767-404fb9ab3f57' },
    { id: 4, name: 'Smartphone Stand', price: 45.95, img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07' }
];

// Simple storefront
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html><head><title>XeriaCO Store - LIVE</title>
<style>body{font-family:Arial;margin:20px;background:#f0f0f0}
.product{background:white;padding:20px;margin:10px;border-radius:10px;display:inline-block;width:300px}
.product img{width:100%;height:200px;object-fit:cover;border-radius:5px}
.price{color:#e74c3c;font-size:24px;font-weight:bold;margin:10px 0}
.btn{background:#e74c3c;color:white;padding:12px 24px;border:none;border-radius:5px;cursor:pointer;width:100%}
.header{background:#000;color:white;padding:20px;text-align:center;margin-bottom:30px}
.stats{background:#28a745;color:white;padding:15px;text-align:center;margin:20px 0;border-radius:5px}
</style></head><body>
<div class="header"><h1>🛍️ XeriaCO</h1><p><strong>LIVE PUBLIC STORE - Ready for Orders!</strong></p></div>
<div class="stats">📊 Orders: ${store.orders.length} | Revenue: $${store.revenue} AUD | Target: $333/day</div>
${products.map(p => `
<div class="product">
<img src="${p.img}" alt="${p.name}">
<h3>${p.name}</h3>
<div class="price">$${p.price} AUD</div>
<button class="btn" onclick="buy(${p.id}, '${p.name}', ${p.price})">🛒 BUY NOW</button>
</div>`).join('')}
<script>
function buy(id, name, price) {
    const email = prompt('Email for confirmation:');
    if (!email) return;
    fetch('/order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, name, price, email})
    }).then(r => r.json()).then(d => {
        alert(d.success ? '🎉 Order successful! Order ID: ' + d.orderId : '❌ Order failed');
        location.reload();
    });
}
</script></body></html>`);
});

// Order processing
app.post('/order', (req, res) => {
    const { id, name, price, email } = req.body;
    const orderId = 'XER-' + Date.now();
    
    store.orders.push({ orderId, name, price, email, time: new Date().toISOString() });
    store.revenue += price;
    
    console.log(`💰 NEW ORDER: ${orderId} - ${name} $${price} from ${email}`);
    console.log(`📊 Total Revenue: $${store.revenue} / $333 target`);
    
    res.json({ success: true, orderId, message: 'Order confirmed!' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'LIVE', orders: store.orders.length, revenue: store.revenue });
});

// Admin stats
app.get('/stats', (req, res) => {
    res.json({
        status: 'XeriaCO LIVE STORE',
        orders: store.orders.length,
        revenue: store.revenue,
        target: 333,
        progress: ((store.revenue / 333) * 100).toFixed(1) + '%',
        recentOrders: store.orders.slice(-5)
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 XeriaCO Store LIVE on port ${PORT}`);
    console.log(`🎯 Public access enabled - Ready for customers!`);
});