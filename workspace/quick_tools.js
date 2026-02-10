/**
 * Quick Tools for XeriaCO Store Management
 * Easy commands for Ben to check store status
 */

const https = require('https');

class QuickTools {
  static async storeStatus() {
    try {
      const [products, orders, health] = await Promise.all([
        QuickTools.fetchAPI('/api/products'),
        QuickTools.fetchAPI('/api/orders'), 
        QuickTools.fetchAPI('/api/health')
      ]);

      const totalProfit = products.products.reduce((sum, p) => sum + p.profitAud, 0);
      const draftCount = products.products.filter(p => p.shopifyStatus === 'draft').length;

      console.log('🏪 XERIACO STORE STATUS');
      console.log('========================');
      console.log(`📦 Products: ${products.pagination.total} total (${draftCount} draft)`);
      console.log(`💰 Profit Potential: $${totalProfit.toFixed(2)} AUD`);
      console.log(`📋 Orders: ${orders.pagination.total} total`);
      console.log(`⚡ System: ${health.status} (uptime: ${Math.floor(health.uptime/3600)}h)`);
      console.log(`🔗 Database: ${health.mongo}`);
      
      if (draftCount > 0) {
        console.log('\\n📋 ACTION NEEDED:');
        console.log(`${draftCount} products need Shopify sync!`);
      }
      
      if (orders.pagination.total === 0) {
        console.log('\\n🎯 GOAL: Get first customer order! 💸');
      }

      return { products: products.pagination.total, orders: orders.pagination.total, profit: totalProfit };
    } catch (error) {
      console.error('❌ Status check failed:', error.message);
      return null;
    }
  }

  static async fetchAPI(endpoint) {
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

  static async profitReport() {
    try {
      const products = await QuickTools.fetchAPI('/api/products');
      
      console.log('💰 PROFIT BREAKDOWN');
      console.log('===================');
      
      products.products.forEach(p => {
        const margin = ((p.profitAud / p.sellingPriceAud) * 100).toFixed(1);
        console.log(`• ${p.title.substring(0, 40)}...`);
        console.log(`  💎 Price: $${p.sellingPriceAud} | 💰 Profit: $${p.profitAud.toFixed(2)} (${margin}%)`);
        console.log('');
      });
      
      const totalProfit = products.products.reduce((sum, p) => sum + p.profitAud, 0);
      console.log(`🎯 TOTAL PROFIT POTENTIAL: $${totalProfit.toFixed(2)} AUD`);
      
    } catch (error) {
      console.error('❌ Profit report failed:', error.message);
    }
  }

  static async checkSyncStatus() {
    try {
      const products = await QuickTools.fetchAPI('/api/products');
      const draftProducts = products.products.filter(p => p.shopifyStatus === 'draft');
      
      console.log('🏪 SHOPIFY SYNC STATUS');
      console.log('=====================');
      
      if (draftProducts.length === 0) {
        console.log('✅ All products synced to Shopify!');
      } else {
        console.log(`📋 ${draftProducts.length} products need syncing:`);
        draftProducts.forEach(p => {
          console.log(`• ${p.title} ($${p.profitAud.toFixed(2)} profit waiting)`);
        });
        console.log('\\n💡 Sync these to start selling!');
      }
      
    } catch (error) {
      console.error('❌ Sync status check failed:', error.message);
    }
  }

  static showCommands() {
    console.log('🔧 XERIACO QUICK TOOLS');
    console.log('======================');
    console.log('node quick_tools.js status     - Full store status');
    console.log('node quick_tools.js profit     - Detailed profit report');  
    console.log('node quick_tools.js sync       - Check Shopify sync status');
    console.log('node quick_tools.js help       - Show this help');
    console.log('');
    console.log('🤖 Automation is running in background!');
  }
}

// CLI interface
const command = process.argv[2];

switch (command) {
  case 'status':
    QuickTools.storeStatus();
    break;
  case 'profit':
    QuickTools.profitReport();
    break;
  case 'sync':
    QuickTools.checkSyncStatus();
    break;
  case 'help':
  default:
    QuickTools.showCommands();
    break;
}

module.exports = QuickTools;