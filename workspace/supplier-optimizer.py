#!/usr/bin/env python3
"""
XeriaCO Supplier Optimizer
Finds cheapest suppliers and optimizes profit margins
"""
import json
import requests
from datetime import datetime

API_BASE = "https://xeriaco.up.railway.app/api"
ADMIN_HEADERS = {"X-Admin-Password": "xeriaco2026", "Content-Type": "application/json"}

def get_all_products():
    """Get all products from store"""
    response = requests.get(f"{API_BASE}/products", headers=ADMIN_HEADERS)
    return response.json()["products"]

def optimize_supplier_pricing():
    """Analyze and optimize supplier costs for maximum profit"""
    products = get_all_products()
    
    print("🔍 SUPPLIER OPTIMIZATION ANALYSIS")
    print("=" * 50)
    
    total_profit_potential = 0
    high_margin_products = []
    optimization_opportunities = []
    
    for product in products:
        title = product.get("title", "")
        cost_usd = product.get("costUsd", 0)
        profit_aud = product.get("profitAud", 0)
        margin_percent = product.get("profitMarginPercent", 0)
        supplier = product.get("supplier", {})
        selling_price_aud = product.get("sellingPriceAud", 0)
        
        total_profit_potential += profit_aud
        
        print(f"\n📦 {title[:40]}...")
        print(f"   💰 Current Profit: ${profit_aud:.2f} AUD ({margin_percent:.1f}%)")
        print(f"   💵 Cost: ${cost_usd:.2f} USD → Selling: ${selling_price_aud:.2f} AUD")
        
        # Supplier analysis
        supplier_name = supplier.get("name", "Unknown")
        supplier_rating = supplier.get("rating", 0)
        supplier_orders = supplier.get("totalOrders", 0)
        
        print(f"   🏪 Supplier: {supplier_name} (Rating: {supplier_rating}/5, Orders: {supplier_orders})")
        
        # Profit optimization suggestions
        if margin_percent > 40:
            high_margin_products.append(title)
            print(f"   ⭐ HIGH MARGIN WINNER! Scale this product!")
        elif margin_percent < 25:
            optimization_opportunities.append({
                "product": title,
                "current_margin": margin_percent,
                "suggested_action": "Find cheaper supplier or increase price"
            })
            print(f"   🔧 OPTIMIZATION NEEDED: Low margin")
        else:
            print(f"   ✅ Good margin - monitor for improvements")
    
    # Summary report
    print("\n" + "=" * 50)
    print("📊 PROFIT OPTIMIZATION SUMMARY")
    print("=" * 50)
    print(f"💰 Total Profit Potential: ${total_profit_potential:.2f} AUD")
    print(f"📦 Total Products: {len(products)}")
    print(f"⭐ High-Margin Winners: {len(high_margin_products)}")
    print(f"🔧 Optimization Opportunities: {len(optimization_opportunities)}")
    
    avg_margin = sum(p.get("profitMarginPercent", 0) for p in products) / len(products) if products else 0
    print(f"📈 Average Profit Margin: {avg_margin:.1f}%")
    
    # Recommendations
    print("\n🚀 OPTIMIZATION RECOMMENDATIONS:")
    
    if high_margin_products:
        print(f"   1. SCALE THESE WINNERS: {', '.join(high_margin_products[:3])}")
    
    if optimization_opportunities:
        print(f"   2. IMPROVE LOW MARGINS:")
        for opp in optimization_opportunities[:3]:
            print(f"      • {opp['product'][:30]}: {opp['current_margin']:.1f}% → {opp['suggested_action']}")
    
    print(f"   3. TARGET COST REDUCTION: Every $1 USD cost reduction = ~$2.50 AUD profit increase")
    print(f"   4. SUPPLIER DIVERSIFICATION: Test 2-3 suppliers per product for best pricing")
    
    return {
        "total_profit_potential": total_profit_potential,
        "total_products": len(products),
        "high_margin_count": len(high_margin_products),
        "avg_margin": avg_margin,
        "optimization_opportunities": len(optimization_opportunities)
    }

def find_trending_product_suggestions():
    """Suggest trending products with high profit potential"""
    suggestions = [
        {
            "title": "Portable Phone Stand - Adjustable Desktop Holder",
            "estimated_cost": 3.50,
            "estimated_profit": 18.50,
            "margin_estimate": "80%+",
            "trend_reason": "Remote work essentials trending"
        },
        {
            "title": "LED Strip Lights - Smart WiFi RGB Controller", 
            "estimated_cost": 8.99,
            "estimated_profit": 25.00,
            "margin_estimate": "65%+",
            "trend_reason": "Home aesthetics & gaming setups"
        },
        {
            "title": "Car Phone Mount - Magnetic Dashboard Holder",
            "estimated_cost": 4.25,
            "estimated_profit": 22.00,
            "margin_estimate": "75%+", 
            "trend_reason": "Travel accessories high demand"
        }
    ]
    
    print("\n🎯 TRENDING PRODUCT OPPORTUNITIES:")
    print("=" * 50)
    
    for suggestion in suggestions:
        print(f"📱 {suggestion['title']}")
        print(f"   💰 Estimated Profit: ${suggestion['estimated_profit']:.2f} AUD ({suggestion['margin_estimate']})")
        print(f"   💵 Estimated Cost: ${suggestion['estimated_cost']:.2f} USD")
        print(f"   📈 Trend Factor: {suggestion['trend_reason']}")
        print()
    
    return suggestions

if __name__ == "__main__":
    optimization_data = optimize_supplier_pricing()
    trending_suggestions = find_trending_product_suggestions()
    
    print(f"\n✅ Analysis complete - {datetime.now().strftime('%H:%M:%S')}")
    print("🚀 Ready to scale your profit empire!")