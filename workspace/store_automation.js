#!/usr/bin/env node

/**
 * XeriaCO Store Automation Engine
 * Comprehensive dropshipping automation for Ben's store
 */

const https = require('https');
const fs = require('fs').promises;

class XeriacoAutomation {
  constructor() {
    this.storeData = {
      products: { count: 7, lastCheck: null },
      orders: { count: 0, lastCheck: null },
      health: { status: 'unknown', lastCheck: null },
      profit: { total: 184.15, lastCheck: null }
    };
    this.alertThresholds = {
      newProductMinProfit: 10, // AUD
      orderCelebration: true,
      systemDowntime: 300000 // 5 minutes
    };
  }

  async checkStore() {
    console.log('🔍 Running XeriaCO Store Check...');
    
    try {
      const [products, orders, health] = await Promise.all([
        this.fetchAPI('/api/products'),
        this.fetchAPI('/api/orders'), 
        this.fetchAPI('/api/health')
      ]);

      const changes = this.detectChanges(products, orders, health);
      await this.handleChanges(changes);
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        changes
      };
    } catch (error) {
      console.error('❌ Store check failed:', error.message);
      await this.notifyError(error);
      return { success: false, error: error.message };
    }
  }

  async fetchAPI(endpoint) {
    return new Promise((resolve, reject) => {
      const url = `https://xeriaco.up.railway.app${endpoint}`;
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Invalid JSON from ${endpoint}`));
          }
        });
      }).on('error', reject);
    });
  }

  detectChanges(products, orders, health) {
    const changes = {
      newProducts: [],
      newOrders: [],
      systemIssues: [],
      profitUpdate: null
    };

    // Check for new products
    if (products.pagination.total > this.storeData.products.count) {
      changes.newProducts = products.products.slice(0, products.pagination.total - this.storeData.products.count);
      this.storeData.products.count = products.pagination.total;
    }

    // Check for new orders  
    if (orders.pagination.total > this.storeData.orders.count) {
      changes.newOrders = orders.orders || [];
      this.storeData.orders.count = orders.pagination.total;
    }

    // Check system health
    if (health.status !== 'ok') {
      changes.systemIssues.push(`System status: ${health.status}`);
    }

    // Calculate total profit
    const totalProfit = products.products.reduce((sum, p) => sum + p.profitAud, 0);
    if (Math.abs(totalProfit - this.storeData.profit.total) > 0.01) {
      changes.profitUpdate = totalProfit;
      this.storeData.profit.total = totalProfit;
    }

    return changes;
  }

  async handleChanges(changes) {
    let notifications = [];

    // New products celebration
    if (changes.newProducts.length > 0) {
      notifications.push(this.formatNewProductsAlert(changes.newProducts));
    }

    // New orders = MONEY! 💰
    if (changes.newOrders.length > 0) {
      notifications.push(this.formatOrderCelebration(changes.newOrders));
    }

    // System issues
    if (changes.systemIssues.length > 0) {
      notifications.push(this.formatSystemAlert(changes.systemIssues));
    }

    // Profit updates
    if (changes.profitUpdate !== null) {
      notifications.push(this.formatProfitUpdate(changes.profitUpdate));
    }

    if (notifications.length > 0) {
      const fullReport = notifications.join('\\n\\n');
      console.log('📢 Sending notifications:', fullReport);
      // In real implementation, this would send to Discord
    }
  }

  formatNewProductsAlert(products) {
    const profitSum = products.reduce((sum, p) => sum + p.profitAud, 0);
    return `🆕 **NEW PRODUCTS DETECTED!** 
    
**Count:** ${products.length} new products
**Profit Potential:** $${profitSum.toFixed(2)} AUD

${products.map(p => `• ${p.title} - $${p.sellingPriceAud} ($${p.profitAud.toFixed(2)} profit)`).join('\\n')}

<@Ben-XeriaCO> <@steve374> - Store inventory expanded! 🚀`;
  }

  formatOrderCelebration(orders) {
    const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    return `💰 **MONEY INCOMING!** 💰

**New Orders:** ${orders.length}
**Revenue:** $${revenue.toFixed(2)} AUD

${orders.map(o => `💳 Order #${o.id || 'NEW'} - $${o.total || 0}`).join('\\n')}

<@Ben-XeriaCO> <@steve374> - CHA-CHING! The machine is working! 🎉💸`;
  }

  formatSystemAlert(issues) {
    return `⚠️ **SYSTEM ALERT** ⚠️

${issues.join('\\n')}

<@Ben-XeriaCO> <@steve374> - Needs attention! 🔧`;
  }

  formatProfitUpdate(newTotal) {
    const change = newTotal - this.storeData.profit.total;
    const changeSymbol = change > 0 ? '📈' : '📉';
    return `${changeSymbol} **PROFIT UPDATE**

**Total Potential:** $${newTotal.toFixed(2)} AUD
**Change:** ${change > 0 ? '+' : ''}$${change.toFixed(2)} AUD`;
  }

  async notifyError(error) {
    console.error('🚨 CRITICAL ERROR - Store monitoring failed');
    console.error(error);
  }

  async startAutomation() {
    console.log('🤖 Starting XeriaCO Automation Engine...');
    
    // Initial check
    await this.checkStore();
    
    // Set up periodic monitoring
    setInterval(() => {
      this.checkStore();
    }, 60 * 60 * 1000); // Every hour
    
    console.log('✅ Automation active - monitoring every hour');
  }
}

// Auto-start if run directly
if (require.main === module) {
  const automation = new XeriacoAutomation();
  automation.startAutomation().catch(console.error);
}

module.exports = XeriacoAutomation;