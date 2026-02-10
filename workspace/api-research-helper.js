// API Helper for Product Research Bot
const { triggerProductResearch, getResearchResults } = require('./trigger-product-research');

class ResearchAPI {
    constructor() {
        this.lastResearchTime = null;
        this.cooldownPeriod = 60000; // 1 minute cooldown
    }

    async requestResearch(category = 'general', options = {}) {
        // Check cooldown
        if (this.lastResearchTime && Date.now() - this.lastResearchTime < this.cooldownPeriod) {
            const waitTime = Math.ceil((this.cooldownPeriod - (Date.now() - this.lastResearchTime)) / 1000);
            throw new Error(`Research cooldown active. Wait ${waitTime} seconds.`);
        }

        try {
            console.log(`🔍 Triggering product research for category: ${category}`);
            await triggerProductResearch();
            this.lastResearchTime = Date.now();
            
            // Wait for research to complete (estimated 15 seconds)
            await new Promise(resolve => setTimeout(resolve, 15000));
            
            return this.getLatestResults();
        } catch (error) {
            console.error('❌ Research request failed:', error);
            throw error;
        }
    }

    getLatestResults() {
        const results = getResearchResults();
        if (results.error) {
            throw new Error('No research data available');
        }
        return results;
    }

    formatForShopify(productData) {
        return {
            title: productData.name,
            body_html: `<p>${productData.description}</p><p><strong>Target Audience:</strong> ${productData.targetAudience}</p>`,
            vendor: 'XeriaCO',
            product_type: productData.category,
            tags: productData.keywords.join(', '),
            price: productData.sellingPrice,
            compare_at_price: (productData.sellingPrice * 1.2).toFixed(2),
            requires_shipping: true,
            weight: 500,
            weight_unit: 'g'
        };
    }

    formatForWooCommerce(productData) {
        return {
            name: productData.name,
            type: 'simple',
            regular_price: productData.sellingPrice.toString(),
            sale_price: '',
            description: productData.description,
            short_description: `${productData.marketingAngle} - Target: ${productData.targetAudience}`,
            categories: [{ name: productData.category }],
            tags: productData.keywords.map(k => ({ name: k })),
            meta_data: [
                { key: 'supplier_price', value: productData.supplierPrice.toString() },
                { key: 'profit_margin', value: productData.profitMargin.toString() },
                { key: 'supplier_name', value: productData.supplier.name },
                { key: 'demand_score', value: productData.demandScore.toString() }
            ]
        };
    }

    generateQuickReport(results) {
        if (!results.products || results.products.length === 0) {
            return 'No products found in research results.';
        }

        const avgMargin = results.avgProfitMargin.toFixed(1);
        const topProduct = results.products.reduce((prev, current) => 
            (prev.profitMargin > current.profitMargin) ? prev : current
        );

        return `📊 Research Complete: ${results.products.length} products analyzed
🎯 Best Product: ${topProduct.name} (${topProduct.profitMargin}% margin)
💰 Average Margin: ${avgMargin}%
📈 Total Profit Potential: $${results.products.reduce((sum, p) => sum + parseFloat(p.profitPerSale), 0).toFixed(2)}`;
    }
}

// Export for use by other modules
module.exports = new ResearchAPI();