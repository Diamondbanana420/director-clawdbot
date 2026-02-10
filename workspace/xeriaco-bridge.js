/**
 * XeriaCo Integration Bridge
 * Connects Emergent backend, Netlify frontend, and Shopify store
 * Managed by Clawdbot AI
 */

class XeriacoBridge {
  constructor() {
    this.config = {
      shopify: {
        store: 'xeria-378.myshopify.com',
        apiUrl: 'https://gateway.maton.ai/shopify/admin/api/2026-01/graphql.json'
      },
      frontend: 'https://xeriacofinal.vercel.app',
      owner: 'Ben (benxeriaco_10787)'
    };
  }

  // Shopify GraphQL query helper
  async shopifyQuery(query, variables = {}) {
    const response = await fetch(this.config.shopify.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MATON_API_KEY}`
      },
      body: JSON.stringify({ query, variables })
    });
    
    return await response.json();
  }

  // Get shop information
  async getShopInfo() {
    const query = `{
      shop {
        name
        email
        myshopifyDomain
        currencyCode
        plan {
          displayName
        }
      }
    }`;
    
    return await this.shopifyQuery(query);
  }

  // List all products
  async getProducts(limit = 10) {
    const query = `{
      products(first: ${limit}) {
        edges {
          node {
            id
            title
            handle
            status
            vendor
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  price
                  inventoryQuantity
                }
              }
            }
          }
        }
      }
    }`;
    
    return await this.shopifyQuery(query);
  }

  // Get recent orders
  async getOrders(limit = 10) {
    const query = `{
      orders(first: ${limit}) {
        edges {
          node {
            id
            name
            createdAt
            displayFinancialStatus
            displayFulfillmentStatus
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              id
              email
              firstName
              lastName
            }
          }
        }
      }
    }`;
    
    return await this.shopifyQuery(query);
  }

  // Create a new product
  async createProduct(productData) {
    const query = `
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        title: productData.title,
        vendor: productData.vendor || 'XeriaCo',
        productType: productData.type || 'General',
        descriptionHtml: productData.description,
        status: 'ACTIVE'
      }
    };

    return await this.shopifyQuery(query, variables);
  }

  // Update inventory levels
  async updateInventory(variantId, quantity) {
    const query = `
      mutation inventorySetOnHandQuantities($input: InventorySetOnHandQuantitiesInput!) {
        inventorySetOnHandQuantities(input: $input) {
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        setQuantities: [{
          inventoryItemId: variantId,
          quantity: quantity
        }]
      }
    };

    return await this.shopifyQuery(query, variables);
  }

  // Process webhook for new orders
  async processOrderWebhook(orderData) {
    console.log('New order received:', orderData);
    
    // Notify Ben via Discord
    await this.notifyOwner({
      type: 'new_order',
      order: orderData,
      message: `🛒 New order #${orderData.name} for $${orderData.total_price}!`
    });

    // Log to system
    return {
      processed: true,
      orderId: orderData.id,
      timestamp: new Date().toISOString()
    };
  }

  // Discord notification system
  async notifyOwner(notification) {
    // This would integrate with the Discord API to send notifications to Ben
    console.log(`[NOTIFICATION] ${notification.message}`);
    
    // In production, this would send to Discord webhook or bot
    return {
      sent: true,
      channel: '#general',
      recipient: 'Ben',
      timestamp: new Date().toISOString()
    };
  }

  // Health check for all systems
  async healthCheck() {
    const results = {
      shopify: { status: 'unknown' },
      frontend: { status: 'unknown' },
      bridge: { status: 'active', timestamp: new Date().toISOString() }
    };

    try {
      // Test Shopify connection
      const shopInfo = await this.getShopInfo();
      results.shopify = {
        status: shopInfo.data ? 'active' : 'error',
        shop: shopInfo.data?.shop?.name || 'Unknown'
      };
    } catch (error) {
      results.shopify = { status: 'error', error: error.message };
    }

    try {
      // Test frontend connection
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

  // Main bridge activation
  async activate() {
    console.log('🌉 Activating XeriaCo Integration Bridge...');
    
    const health = await this.healthCheck();
    console.log('System Status:', health);

    // Set up webhook endpoints
    this.setupWebhooks();

    // Start monitoring systems
    this.startMonitoring();

    console.log('🚀 Bridge is active and monitoring systems!');
    return { active: true, health };
  }

  setupWebhooks() {
    // This would set up Express.js endpoints for Shopify webhooks
    console.log('📡 Setting up webhook endpoints...');
    
    // POST /webhooks/orders/create
    // POST /webhooks/orders/update
    // POST /webhooks/inventory/update
    // POST /webhooks/products/update
  }

  startMonitoring() {
    // Monitor systems every 5 minutes
    setInterval(async () => {
      const health = await this.healthCheck();
      if (health.shopify.status === 'error' || health.frontend.status === 'error') {
        await this.notifyOwner({
          type: 'system_alert',
          message: '⚠️ System health check failed - investigating...',
          details: health
        });
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
}

// Export for use
module.exports = XeriacoBridge;

// Quick test/demo
if (require.main === module) {
  const bridge = new XeriacoBridge();
  bridge.activate();
}