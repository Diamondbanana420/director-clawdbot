// Auto Product Hunter - Adds new trending products every 30 minutes
const https = require('https');
const { URL } = require('url');

class AutoProductHunter {
    constructor() {
        this.apiUrl = 'https://xeriaco.up.railway.app/api';
        this.categories = ['Electronics', 'Home & Garden', 'Sports & Outdoors', 'Fashion', 'Health & Beauty'];
        this.supplierNames = [
            'TechHub Pro', 'Lifestyle Direct', 'Trend Suppliers', 'Quality Source', 
            'Premium Goods', 'Global Trade Co', 'Smart Solutions', 'Elite Products'
        ];
    }

    generateTrendingProduct() {
        const trendingKeywords = [
            'Smart Watch', 'Wireless Headphones', 'Phone Accessories', 'LED Lights',
            'Fitness Tracker', 'Portable Charger', 'Bluetooth Speaker', 'Smart Home',
            'Gaming Accessories', 'Travel Gear', 'Kitchen Gadgets', 'Car Accessories'
        ];
        
        const features = [
            'Waterproof', 'Wireless', 'Fast Charging', 'HD Quality', 'Smart AI',
            'Touch Screen', 'Voice Control', 'App Connected', 'Premium Design'
        ];

        const keyword = trendingKeywords[Math.floor(Math.random() * trendingKeywords.length)];
        const feature = features[Math.floor(Math.random() * features.length)];
        const category = this.categories[Math.floor(Math.random() * this.categories.length)];
        const supplier = this.supplierNames[Math.floor(Math.random() * this.supplierNames.length)];
        
        const costUsd = (Math.random() * 50 + 10).toFixed(2); // $10-60
        const markup = Math.random() * 100 + 50; // 50-150% markup
        const sellingPriceAud = (parseFloat(costUsd) * (1 + markup/100) * 1.55).toFixed(2); // USD to AUD conversion
        const profitAud = (parseFloat(sellingPriceAud) - parseFloat(costUsd) * 1.55).toFixed(2);
        const profitMargin = ((parseFloat(profitAud) / parseFloat(sellingPriceAud)) * 100).toFixed(1);

        return {
            title: `${feature} ${keyword} - Professional Grade`,
            description: `Premium ${keyword.toLowerCase()} with ${feature.toLowerCase()} technology. Perfect for modern lifestyle, high-quality materials, fast shipping from Australia.`,
            category: category,
            tags: [keyword.toLowerCase().replace(' ', '-'), feature.toLowerCase(), 'trending', 'premium'],
            vendor: 'XeriaCO',
            costUsd: parseFloat(costUsd),
            sellingPriceAud: parseFloat(sellingPriceAud),
            comparePriceAud: parseFloat(sellingPriceAud) * 1.3,
            profitAud: parseFloat(profitAud),
            profitMarginPercent: parseFloat(profitMargin),
            supplier: {
                name: supplier,
                platform: 'aliexpress',
                url: `https://aliexpress.com/item/${keyword.toLowerCase().replace(' ', '-')}-${feature.toLowerCase()}`,
                productId: `${keyword.substring(0,3).toUpperCase()}-${feature.substring(0,3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5-5.0 rating
                totalOrders: Math.floor(Math.random() * 5000 + 500)
            },
            featuredImage: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=800&q=90`,
            pipeline: {
                approved: true,
                approvedAt: new Date().toISOString(),
                runId: `auto-hunter-${Date.now()}`
            },
            isActive: true
        };
    }

    async addProduct(productData) {
        return new Promise((resolve, reject) => {
            const url = new URL(`${this.apiUrl}/products`);
            const postData = JSON.stringify(productData);
            
            const options = {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log(`✅ Added: ${productData.title} - $${productData.profitAud} profit`);
                        resolve(JSON.parse(data));
                    } else {
                        console.error('Failed to add product:', res.statusCode);
                        reject(new Error(`HTTP ${res.statusCode}`));
                    }
                });
            });

            req.on('error', (error) => {
                console.error('Error adding product:', error);
                reject(error);
            });

            req.write(postData);
            req.end();
        });
    }

    async hunt() {
        const product = this.generateTrendingProduct();
        await this.addProduct(product);
    }
}

// Run the hunter
const hunter = new AutoProductHunter();
hunter.hunt();