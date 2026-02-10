/**
 * XeriaCo Direct Shopify Integration Bridge
 * Direct API integration without Maton dependency
 * Managed by Clawdbot AI
 */

class ShopifyDirectBridge {
  constructor(config) {
    this.config = {
      shopify: {
        store: 'xeria-378.myshopify.com',
        apiVersion: '2024-01',
        // Using direct Shopify Admin API
        baseUrl: `https://xeria-378.myshopify.com/admin/api/2024-01`
      },
      frontend: 'https://xeriacofinal.vercel.app',
      owner: 'Ben (benxeriaco_10787)',
      ...config
    };
  }

  // Direct Shopify REST API call
  async shopifyRequest(endpoint, options = {}) {
    const url = `${this.config.shopify.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN
    };

    const response = await fetch(url, {
      method: 'GET',
      headers: { ...defaultHeaders, ...options.headers },
      ...options
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // Get shop information
  async getShopInfo() {
    return await this.shopifyRequest('/shop.json');
  }

  // Get all products
  async getProducts(limit = 50) {
    return await this.shopifyRequest(`/products.json?limit=${limit}`);
  }

  // Get specific product
  async getProduct(productId) {
    return await this.shopifyRequest(`/products/${productId}.json`);
  }

  // Create new product
  async createProduct(productData) {
    return await this.shopifyRequest('/products.json', {
      method: 'POST',
      body: JSON.stringify({
        product: {
          title: productData.title,
          vendor: productData.vendor || 'XeriaCo',
          product_type: productData.type || 'General',
          body_html: productData.description,
          status: 'active',
          variants: productData.variants || [{
            price: productData.price || '0.00',
            inventory_quantity: productData.inventory || 0
          }]
        }
      })
    });
  }

  // Update product
  async updateProduct(productId, updates) {
    return await this.shopifyRequest(`/products/${productId}.json`, {
      method: 'PUT',
      body: JSON.stringify({ product: updates })
    });
  }

  // Get orders
  async getOrders(limit = 50, status = 'any') {
    return await this.shopifyRequest(`/orders.json?limit=${limit}&status=${status}`);
  }

  // Get specific order
  async getOrder(orderId) {
    return await this.shopifyRequest(`/orders/${orderId}.json`);
  }

  // Update order
  async updateOrder(orderId, updates) {
    return await this.shopifyRequest(`/orders/${orderId}.json`, {
      method: 'PUT',
      body: JSON.stringify({ order: updates })
    });
  }

  // Get customers
  async getCustomers(limit = 50) {
    return await this.shopifyRequest(`/customers.json?limit=${limit}`);
  }

  // Create customer
  async createCustomer(customerData) {
    return await this.shopifyRequest('/customers.json', {
      method: 'POST',
      body: JSON.stringify({ customer: customerData })
    });
  }

  // Inventory management
  async getInventoryLevels() {
    const products = await this.getProducts();
    const inventory = [];
    
    for (const product of products.products) {
      for (const variant of product.variants) {
        inventory.push({
          productId: product.id,
          variantId: variant.id,
          title: product.title,
          variant: variant.title,
          price: variant.price,
          inventory: variant.inventory_quantity,
          sku: variant.sku
        });
      }
    }
    
    return inventory;
  }

  // Update inventory
  async updateInventory(variantId, quantity) {
    return await this.shopifyRequest(`/variants/${variantId}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        variant: {
          id: variantId,
          inventory_quantity: quantity
        }
      })
    });
  }

  // Create webhook
  async createWebhook(topic, address) {
    return await this.shopifyRequest('/webhooks.json', {
      method: 'POST',
      body: JSON.stringify({
        webhook: {
          topic: topic,
          address: address,
          format: 'json'
        }
      })
    });
  }

  // List webhooks
  async getWebhooks() {
    return await this.shopifyRequest('/webhooks.json');
  }

  // Process order webhook (called when Shopify sends webhook)
  async processOrderWebhook(orderData) {
    console.log('🛒 New order received:', orderData);
    
    const orderInfo = {
      id: orderData.id,
      number: orderData.number,
      email: orderData.email,
      total: orderData.total_price,
      currency: orderData.currency,
      customer: orderData.customer,
      line_items: orderData.line_items
    };

    // Notify Ben
    await this.notifyOwner({
      type: 'new_order',
      message: `🛒 New Order #${orderInfo.number}!\n💰 Amount: ${orderInfo.currency} ${orderInfo.total}\n👤 Customer: ${orderInfo.email}`,
      order: orderInfo
    });

    // Auto-process if needed
    await this.autoProcessOrder(orderInfo);

    return { processed: true, orderId: orderInfo.id };
  }

  // Auto process order (fulfill, notify customer, etc.)
  async autoProcessOrder(order) {
    try {
      // Update order with fulfillment tracking
      console.log(`📦 Auto-processing order #${order.number}`);
      
      // Here you'd integrate with your supplier API
      // For now, just mark as processed
      const processed = {
        status: 'processing',
        fulfillment_status: 'pending',
        processed_at: new Date().toISOString()
      };

      return processed;
    } catch (error) {
      console.error('Error auto-processing order:', error);
      await this.notifyOwner({
        type: 'error',
        message: `⚠️ Failed to auto-process order #${order.number}: ${error.message}`
      });
    }
  }

  // Discord notification system
  async notifyOwner(notification) {
    // This integrates with your Discord webhook
    console.log(`[NOTIFICATION] ${notification.message}`);
    
    if (process.env.DISCORD_WEBHOOK_URL) {
      try {
        await fetch(process.env.DISCORD_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: notification.message,
            username: 'XeriaCo Bot'
          })
        });
      } catch (error) {
        console.error('Failed to send Discord notification:', error);
      }
    }

    return { sent: true, timestamp: new Date().toISOString() };
  }

  // Health check
  async healthCheck() {
    const results = {
      shopify: { status: 'unknown' },
      frontend: { status: 'unknown' },
      bridge: { status: 'active', timestamp: new Date().toISOString() }
    };

    try {
      const shopInfo = await this.getShopInfo();
      results.shopify = {
        status: 'active',
        shop: shopInfo.shop.name,
        plan: shopInfo.shop.plan_name,
        email: shopInfo.shop.email
      };
    } catch (error) {
      results.shopify = { status: 'error', error: error.message };
    }

    try {
      const frontendResponse = await fetch(this.config.frontend);
      results.frontend = {
        status: frontendResponse.ok ? 'active' : 'error',
        statusCode: frontendResponse.status
      };
    } catch (error) {
      results.frontend = { status: 'error', error: error.message };
    }

    return results;
  }

  // Setup webhooks for automatic order processing
  async setupWebhooks(baseUrl) {
    const webhooks = [
      { topic: 'orders/create', endpoint: '/webhooks/orders/create' },
      { topic: 'orders/updated', endpoint: '/webhooks/orders/updated' },
      { topic: 'orders/paid', endpoint: '/webhooks/orders/paid' },
      { topic: 'orders/cancelled', endpoint: '/webhooks/orders/cancelled' }
    ];

    const results = [];
    for (const webhook of webhooks) {
      try {
        const result = await this.createWebhook(webhook.topic, `${baseUrl}${webhook.endpoint}`);
        results.push({ ...webhook, success: true, id: result.webhook.id });
      } catch (error) {
        results.push({ ...webhook, success: false, error: error.message });
      }
    }

    return results;
  }

  // Main activation
  async activate(emergentUrl) {
    console.log('🌉 Activating Direct Shopify Integration Bridge...');
    
    // Check health
    const health = await this.healthCheck();
    console.log('System Status:', health);

    // Setup webhooks if Emergent URL provided
    if (emergentUrl) {
      const webhooks = await this.setupWebhooks(emergentUrl);
      console.log('Webhooks setup:', webhooks);
    }

    // Start monitoring
    this.startMonitoring();

    console.log('🚀 Direct Shopify Bridge is active!');
    return { active: true, health };
  }

  startMonitoring() {
    setInterval(async () => {
      const health = await this.healthCheck();
      if (health.shopify.status === 'error' || health.frontend.status === 'error') {
        await this.notifyOwner({
          type: 'system_alert',
          message: '⚠️ System health check failed - investigating...'
        });
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Quick revenue report
  async getDailyRevenue() {
    const today = new Date().toISOString().split('T')[0];
    const orders = await this.getOrders(250, 'any');
    
    const todayOrders = orders.orders.filter(order => 
      order.created_at.startsWith(today) && 
      order.financial_status === 'paid'
    );

    const revenue = todayOrders.reduce((total, order) => 
      total + parseFloat(order.total_price), 0
    );

    return {
      date: today,
      orders: todayOrders.length,
      revenue: revenue.toFixed(2),
      currency: todayOrders[0]?.currency || 'USD'
    };
  }
}

module.exports = ShopifyDirectBridge;

// Quick test
if (require.main === module) {
  const bridge = new ShopifyDirectBridge();
  bridge.activate('https://your-emergent-backend.com');
}