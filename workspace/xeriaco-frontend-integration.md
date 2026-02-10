# XeriaCo Frontend Cart Integration

## API Endpoints
Replace the backend cart endpoints with:

```javascript
const CART_API_BASE = 'http://localhost:3002'; // Or public URL if tunneled

// Add to cart
fetch(`${CART_API_BASE}/api/cart/add`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: getUserSessionId(), // Generate or get from localStorage
    productId: product._id,
    quantity: 1,
    price: product.sellingPriceAud,
    title: product.title,
    image: product.featuredImage
  })
});

// Get cart
fetch(`${CART_API_BASE}/api/cart/${sessionId}`)
  .then(res => res.json());

// Checkout
fetch(`${CART_API_BASE}/api/checkout`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: sessionId,
    customerEmail: email,
    customerName: name,
    shippingAddress: address,
    paymentMethod: 'credit_card'
  })
});
```

## Session Management
```javascript
function getUserSessionId() {
  let sessionId = localStorage.getItem('xeriaco_session');
  if (!sessionId) {
    sessionId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('xeriaco_session', sessionId);
  }
  return sessionId;
}
```

## Revenue Restoration Status: ✅ READY FOR SALES
