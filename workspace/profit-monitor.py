#!/usr/bin/env python3
"""
XeriaCO Profit Monitor
Tracks revenue, profits, and performance metrics
"""
import json
import requests
from datetime import datetime

API_BASE = "https://xeriaco.up.railway.app/api"
ADMIN_HEADERS = {"X-Admin-Password": "xeriaco2026", "Content-Type": "application/json"}

def get_products():
    """Get all products from the store"""
    response = requests.get(f"{API_BASE}/products", headers=ADMIN_HEADERS)
    return response.json()["products"]

def get_orders():
    """Get all orders from the store"""
    response = requests.get(f"{API_BASE}/orders", headers=ADMIN_HEADERS)
    return response.json()["orders"]

def calculate_profit_metrics():
    """Calculate comprehensive profit metrics"""
    products = get_products()
    orders = get_orders()
    
    total_potential_profit = 0
    total_products = len(products)
    avg_profit_margin = 0
    high_margin_products = 0
    
    print("🏪 XeriaCO Store Performance Dashboard")
    print("=" * 50)
    print(f"📦 Total Products: {total_products}")
    
    if products:
        for product in products:
            profit_aud = product.get("profitAud", 0)
            profit_margin = product.get("profitMarginPercent", 0)
            selling_price = product.get("sellingPriceAud", 0)
            
            total_potential_profit += profit_aud
            avg_profit_margin += profit_margin
            
            if profit_margin > 30:
                high_margin_products += 1
            
            print(f"  • {product['title'][:40]}...")
            print(f"    💰 Profit: ${profit_aud:.2f} AUD ({profit_margin:.1f}% margin)")
            print(f"    💵 Price: ${selling_price:.2f} AUD")
            print()
        
        avg_profit_margin = avg_profit_margin / total_products if total_products > 0 else 0
        
        print("📊 PROFIT METRICS:")
        print(f"  💸 Potential Profit Pool: ${total_potential_profit:.2f} AUD")
        print(f"  📈 Average Profit Margin: {avg_profit_margin:.1f}%")
        print(f"  ⭐ High-Margin Products (30%+): {high_margin_products}/{total_products}")
        print()
    
    print(f"📋 Total Orders: {len(orders)}")
    
    # Calculate actual revenue if orders exist
    if orders:
        total_revenue = sum(order.get("totalPrice", 0) for order in orders)
        print(f"💰 Total Revenue: ${total_revenue:.2f}")
    else:
        print("💰 Revenue: $0 (No orders yet - store ready for customers!)")
    
    print()
    print("⚡ AUTOMATION STATUS:")
    print("  ✅ Product Management: ACTIVE")
    print("  ✅ Profit Calculation: AUTOMATED") 
    print("  ⏳ Shopify Sync: PENDING API ACCESS")
    print("  ⏳ Order Processing: READY")
    
    return {
        "totalProducts": total_products,
        "totalPotentialProfit": total_potential_profit,
        "avgProfitMargin": avg_profit_margin,
        "highMarginProducts": high_margin_products,
        "totalOrders": len(orders)
    }

if __name__ == "__main__":
    metrics = calculate_profit_metrics()