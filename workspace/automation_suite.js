#!/usr/bin/env node

/**
 * XeriaCO Complete Automation Suite
 * Everything needed to run the store autonomously
 */

const XeriacoAutomation = require('./store_automation');

class AutomationSuite {
  constructor() {
    this.storeMonitor = new XeriacoAutomation();
    this.tasks = [];
    this.analytics = {
      checksPerformed: 0,
      alertsSent: 0,
      errorsDetected: 0,
      ordersProcessed: 0
    };
  }

  async initialize() {
    console.log('🚀 XeriaCO Automation Suite Starting Up...');
    
    // Core tasks to run
    this.tasks = [
      {
        name: 'Store Health Monitor',
        interval: 30 * 60 * 1000, // 30 minutes
        action: () => this.storeHealthCheck()
      },
      {
        name: 'Product Sync Check', 
        interval: 60 * 60 * 1000, // 1 hour
        action: () => this.productSyncCheck()
      },
      {
        name: 'Order Processing',
        interval: 15 * 60 * 1000, // 15 minutes  
        action: () => this.orderProcessingCheck()
      },
      {
        name: 'Shopify Sync Status',
        interval: 2 * 60 * 60 * 1000, // 2 hours
        action: () => this.shopifySyncCheck()
      },
      {
        name: 'Daily Report',
        interval: 24 * 60 * 60 * 1000, // 24 hours
        action: () => this.dailyReport()
      }
    ];

    // Start all tasks
    this.tasks.forEach(task => {
      console.log(`⏰ Scheduling: ${task.name} every ${task.interval/60000} minutes`);
      setInterval(task.action, task.interval);
      
      // Run immediately for initial check
      setTimeout(task.action, 5000); // 5 second delay
    });

    console.log('✅ All automation tasks scheduled!');
  }

  async storeHealthCheck() {
    try {
      console.log('🩺 Running store health check...');
      const result = await this.storeMonitor.checkStore();
      
      this.analytics.checksPerformed++;
      
      if (!result.success) {
        this.analytics.errorsDetected++;
        await this.alertCritical('Store health check failed', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Health check error:', error);
    }
  }

  async productSyncCheck() {
    try {
      console.log('📦 Checking product sync status...');
      
      const products = await this.storeMonitor.fetchAPI('/api/products');
      const draftProducts = products.products.filter(p => p.shopifyStatus === 'draft');
      
      if (draftProducts.length > 0) {
        await this.alertInfo(`📋 Products pending Shopify sync`, 
          `${draftProducts.length} products still in draft status:\\n` +
          draftProducts.map(p => `• ${p.title} ($${p.profitAud.toFixed(2)} profit)`).join('\\n') +
          '\\n\\n<@Ben-XeriaCO> <@steve374> - Consider syncing to Shopify! 💰'
        );
      }
      
    } catch (error) {
      console.error('❌ Product sync check failed:', error);
    }
  }

  async orderProcessingCheck() {
    try {
      console.log('💳 Checking for new orders...');
      
      const orders = await this.storeMonitor.fetchAPI('/api/orders');
      
      if (orders.pagination.total > this.analytics.ordersProcessed) {
        const newOrders = orders.pagination.total - this.analytics.ordersProcessed;
        this.analytics.ordersProcessed = orders.pagination.total;
        this.analytics.alertsSent++;
        
        await this.alertCelebration(`💰 NEW ORDERS DETECTED!`, 
          `${newOrders} new order(s) received!\\n` +
          `Total orders: ${orders.pagination.total}\\n\\n` +
          `<@Ben-XeriaCO> <@steve374> - MONEY TIME! 🎉💸`
        );
      }
      
    } catch (error) {
      console.error('❌ Order check failed:', error);
    }
  }

  async shopifySyncCheck() {
    try {
      console.log('🏪 Checking Shopify connection...');
      
      // This would normally check Shopify API health
      // For now, just verify our backend is responsive
      const health = await this.storeMonitor.fetchAPI('/api/health');
      
      if (health.mongo !== 'connected') {
        await this.alertCritical('Database issue detected', 
          `MongoDB status: ${health.mongo}\\n` +
          '<@Ben-XeriaCO> <@steve374> - Database needs attention! 🚨'
        );
      }
      
    } catch (error) {
      await this.alertCritical('Shopify sync check failed', error.message);
    }
  }

  async dailyReport() {
    try {
      console.log('📊 Generating daily report...');
      
      const [products, orders, health] = await Promise.all([
        this.storeMonitor.fetchAPI('/api/products'),
        this.storeMonitor.fetchAPI('/api/orders'),
        this.storeMonitor.fetchAPI('/api/health')
      ]);

      const totalProfit = products.products.reduce((sum, p) => sum + p.profitAud, 0);
      const totalRevenue = products.products.reduce((sum, p) => sum + p.sellingPriceAud, 0);
      
      const report = `📊 **DAILY XERIACO REPORT** 📊

**📦 Products:** ${products.pagination.total} active
**💰 Potential Profit:** $${totalProfit.toFixed(2)} AUD  
**💎 Total Revenue Potential:** $${totalRevenue.toFixed(2)} AUD
**📋 Orders:** ${orders.pagination.total} total
**⚡ System Status:** ${health.status}
**🕐 Uptime:** ${Math.floor(health.uptime/3600)}h ${Math.floor((health.uptime%3600)/60)}m

**📈 Analytics:**
• Health checks: ${this.analytics.checksPerformed}
• Alerts sent: ${this.analytics.alertsSent}  
• Errors detected: ${this.analytics.errorsDetected}

<@Ben-XeriaCO> <@steve374> - Your empire status! 👑`;

      await this.alertInfo('Daily Store Report', report);
      
    } catch (error) {
      console.error('❌ Daily report failed:', error);
    }
  }

  async alertCritical(title, message) {
    console.log(`🚨 CRITICAL: ${title}`);
    console.log(message);
    // In real implementation, send to Discord with high priority
  }

  async alertCelebration(title, message) {
    console.log(`🎉 CELEBRATION: ${title}`);
    console.log(message);
    // In real implementation, send to Discord with celebration emojis
  }

  async alertInfo(title, message) {
    console.log(`ℹ️ INFO: ${title}`);
    console.log(message);
    // In real implementation, send to Discord as normal message
  }

  getStatus() {
    return {
      tasksRunning: this.tasks.length,
      analytics: this.analytics,
      uptime: process.uptime(),
      status: 'active'
    };
  }
}

// Auto-start if run directly
if (require.main === module) {
  const suite = new AutomationSuite();
  suite.initialize().catch(console.error);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\\n🛑 Automation suite shutting down...');
    console.log('📊 Final stats:', suite.getStatus());
    process.exit(0);
  });
}

module.exports = AutomationSuite;