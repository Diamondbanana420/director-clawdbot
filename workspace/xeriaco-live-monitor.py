#!/usr/bin/env python3
"""
XeriaCO Live Monitor - Integrated with Clawdbot messaging
"""
import json
import requests
import subprocess
from datetime import datetime
import sys

# Configuration  
API_BASE = "https://xeriaco.up.railway.app/api"
ADMIN_HEADERS = {"X-Admin-Password": "xeriaco2026", "Content-Type": "application/json"}
DISCORD_CHANNEL = "1468521660150976522"
STATE_FILE = "/root/clawd/xeriaco-state.json"

def load_state():
    try:
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    except:
        return {"products": {}, "orders": {}, "last_check": None}

def save_state(state):
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f)

def send_discord_message(message):
    """Send message using clawdbot message tool"""
    try:
        # Using subprocess to call clawdbot message command
        cmd = ['clawdbot', 'message', '--channel', 'discord', '--target', DISCORD_CHANNEL, message]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            print(f"✅ Discord alert sent: {message[:50]}...")
            return True
        else:
            print(f"❌ Discord alert failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error sending Discord alert: {e}")
        return False

def monitor_store():
    """Main monitoring function with Discord integration"""
    print(f"🔍 XeriaCO Live Monitor - {datetime.now().strftime('%H:%M:%S')}")
    
    state = load_state()
    alerts = []
    
    # Check Products
    try:
        response = requests.get(f"{API_BASE}/products", headers=ADMIN_HEADERS, timeout=10)
        current_products = {p["_id"]: p for p in response.json()["products"]}
        previous_products = state.get("products", {})
        
        # Detect new products
        for product_id, product in current_products.items():
            if product_id not in previous_products:
                profit = product.get("profitAud", 0)
                margin = product.get("profitMarginPercent", 0)
                price = product.get("sellingPriceAud", 0)
                
                alert = f"""🆕 **NEW PRODUCT LIVE!**
**{product['title'][:40]}**
💰 ${profit:.2f} AUD profit ({margin:.1f}%)
💵 ${price:.2f} AUD retail price
🚀 Ready to make money!"""
                alerts.append(alert)
                
        state["products"] = current_products
        
    except Exception as e:
        alerts.append(f"❌ **STORE MONITOR ERROR**: Products API failed - {e}")
    
    # Check Orders
    try:
        response = requests.get(f"{API_BASE}/orders", headers=ADMIN_HEADERS, timeout=10)
        current_orders = {o.get("_id", f"order_{i}"): o for i, o in enumerate(response.json()["orders"])}
        previous_orders = state.get("orders", {})
        
        # Detect new orders
        for order_id, order in current_orders.items():
            if order_id not in previous_orders:
                total = order.get("totalPrice", 0)
                customer = order.get("customerEmail", "Customer")
                
                alert = f"""💰 **CA-CHING! NEW ORDER!**
🎉 **MONEY MADE**: ${total:.2f}
👤 {customer}
📦 Order ID: {order_id[:8]}
🚀 **PROFIT INCOMING!**"""
                alerts.append(alert)
                
        state["orders"] = current_orders
        
    except Exception as e:
        alerts.append(f"❌ **ORDER MONITOR ERROR**: Orders API failed - {e}")
    
    # Check System Health
    try:
        response = requests.get(f"{API_BASE}/health", timeout=10)
        health = response.json()
        uptime = health.get("uptime", 0)
        
        if uptime < 300:  # Less than 5 minutes = restart
            alerts.append(f"🔄 **SYSTEM RESTART**: Store back online (uptime: {uptime}s)")
            
    except Exception as e:
        alerts.append(f"💥 **SYSTEM DOWN**: {e}")
    
    # Save state and send alerts
    state["last_check"] = datetime.now().isoformat()
    save_state(state)
    
    if alerts:
        for alert in alerts:
            send_discord_message(alert)
        print(f"📢 Sent {len(alerts)} alerts to Discord")
    else:
        print(f"✅ All good - {len(state.get('products', {}))} products, {len(state.get('orders', {}))} orders")
    
    return len(alerts)

if __name__ == "__main__":
    monitor_store()