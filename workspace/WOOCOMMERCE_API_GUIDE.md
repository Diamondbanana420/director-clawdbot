# WooCommerce API Setup Guide

## 🛒 Getting WooCommerce REST API Access

### Step 1: Enable WooCommerce REST API
1. **Login to WordPress Admin**
2. **Go to:** WooCommerce → Settings → Advanced → REST API
3. **Click:** "Add Key"

### Step 2: Create API Keys
**Fill out the form:**
- **Description:** `XeriaCo API Integration`
- **User:** Select your admin user
- **Permissions:** `Read/Write`
- **Click:** Generate API Key

### Step 3: Save Your Credentials
**Copy and save these (shown only once):**
- **Consumer Key:** `ck_xxxxxxxxxxxxxxxxxxxxx`
- **Consumer Secret:** `cs_xxxxxxxxxxxxxxxxxxxxx`
- **API Base URL:** `https://yoursite.com/wp-json/wc/v3/`

### Step 4: API Endpoints
**Common endpoints:**
- **Products:** `GET/POST /products`
- **Orders:** `GET/POST /orders`
- **Customers:** `GET/POST /customers`
- **Categories:** `GET/POST /products/categories`

### Step 5: Authentication
**Use HTTP Basic Auth:**
- **Username:** Consumer Key
- **Password:** Consumer Secret

### Example API Call
```bash
curl -X GET https://yoursite.com/wp-json/wc/v3/products \
  -u ck_xxxxx:cs_xxxxx
```

### Example JavaScript
```javascript
const WooCommerceAPI = require('woocommerce-api');

const api = new WooCommerceAPI({
  url: 'https://yoursite.com',
  consumerKey: 'ck_xxxxx',
  consumerSecret: 'cs_xxxxx',
  version: 'wc/v3'
});
```

## 🔗 Integration with XeriaCo
**Your site:** `https://xeriaco-frontend-production.up.railway.app/`
**Backend:** `https://xeriaco-backend-production.up.railway.app/`

The product research bot can output data in WooCommerce-compatible format for direct import!