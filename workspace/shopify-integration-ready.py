#!/usr/bin/env python3
"""
Shopify Integration Script - Ready for API Token
Once Ben provides the token, this will sync all products automatically
"""
import json
import requests
from datetime import datetime

# Configuration  
RAILWAY_API_BASE = "https://xeriaco.up.railway.app/api"
RAILWAY_HEADERS = {"X-Admin-Password": "xeriaco2026", "Content-Type": "application/json"}
SHOPIFY_STORE = "xeria-378.myshopify.com"

def get_railway_products():
    """Get all products from Railway backend"""
    try:
        response = requests.get(f"{RAILWAY_API_BASE}/products", headers=RAILWAY_HEADERS)
        return response.json()["products"]
    except Exception as e:
        print(f"❌ Error getting Railway products: {e}")
        return []

def sync_product_to_shopify(product, shopify_token):
    """Sync a single product from Railway to Shopify"""
    shopify_headers = {
        "X-Shopify-Access-Token": shopify_token,
        "Content-Type": "application/json"
    }
    
    # Convert Railway product to Shopify format
    shopify_product = {
        "product": {
            "title": product["title"],
            "body_html": product["description"],
            "vendor": product.get("vendor", "XeriaCO"),
            "product_type": product.get("category", ""),
            "tags": ", ".join(product.get("tags", [])),
            "images": [{"src": product["featuredImage"]}] if product.get("featuredImage") else [],
            "variants": [{
                "price": str(product["sellingPriceAud"]),
                "compare_at_price": str(product.get("comparePriceAud", 0)),
                "inventory_management": "shopify",
                "inventory_quantity": product.get("inventory", {}).get("quantity", 0)
            }],
            "status": "active"
        }
    }
    
    try:
        response = requests.post(
            f"https://{SHOPIFY_STORE}/admin/api/2023-10/products.json",
            headers=shopify_headers,
            json=shopify_product,
            timeout=30
        )
        
        if response.status_code == 201:
            shopify_product_data = response.json()["product"]
            return {
                "success": True,
                "shopify_id": shopify_product_data["id"],
                "shopify_url": f"https://{SHOPIFY_STORE}/admin/products/{shopify_product_data['id']}"
            }
        else:
            return {
                "success": False,
                "error": f"HTTP {response.status_code}: {response.text}"
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def sync_all_products_to_shopify(shopify_token):
    """Sync all Railway products to Shopify"""
    print("🚀 STARTING SHOPIFY SYNC AUTOMATION")
    print("=" * 50)
    
    railway_products = get_railway_products()
    
    if not railway_products:
        print("❌ No products found in Railway backend")
        return
    
    print(f"📦 Found {len(railway_products)} products to sync...")
    
    sync_results = []
    total_profit_potential = 0
    
    for i, product in enumerate(railway_products, 1):
        title = product["title"]
        profit = product.get("profitAud", 0)
        total_profit_potential += profit
        
        print(f"\n{i}. Syncing: {title[:40]}...")
        print(f"   💰 Profit per sale: ${profit:.2f} AUD")
        
        result = sync_product_to_shopify(product, shopify_token)
        sync_results.append({
            "product": title,
            "result": result
        })
        
        if result["success"]:
            print(f"   ✅ SUCCESS: Shopify ID {result['shopify_id']}")
            
            # Update Railway with Shopify ID
            update_data = {
                "shopifyProductId": result["shopify_id"],
                "shopifyStatus": "active",
                "lastSyncedToShopify": datetime.now().isoformat()
            }
            
            try:
                requests.patch(
                    f"{RAILWAY_API_BASE}/products/{product['_id']}",
                    headers=RAILWAY_HEADERS,
                    json=update_data,
                    timeout=10
                )
                print(f"   🔄 Railway updated with Shopify ID")
            except:
                print(f"   ⚠️ Warning: Could not update Railway record")
                
        else:
            print(f"   ❌ FAILED: {result['error']}")
    
    # Final summary
    successful_syncs = sum(1 for r in sync_results if r["result"]["success"])
    
    print("\n" + "=" * 50)
    print("🎉 SHOPIFY SYNC COMPLETE!")
    print("=" * 50)
    print(f"✅ Successfully synced: {successful_syncs}/{len(railway_products)} products")
    print(f"💰 Total profit potential: ${total_profit_potential:.2f} AUD")
    print(f"🏪 Store URL: https://{SHOPIFY_STORE}")
    print(f"⚡ Your money machine is now LIVE!")
    
    return sync_results

def test_shopify_connection(shopify_token):
    """Test Shopify API connection"""
    headers = {"X-Shopify-Access-Token": shopify_token}
    
    try:
        response = requests.get(
            f"https://{SHOPIFY_STORE}/admin/api/2023-10/shop.json",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            shop_data = response.json()["shop"]
            print(f"✅ Connected to: {shop_data['name']}")
            print(f"📧 Email: {shop_data['email']}")
            print(f"🌐 Domain: {shop_data['domain']}")
            return True
        else:
            print(f"❌ Connection failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

# Ready to execute once token is provided
def execute_full_integration(shopify_token):
    """Execute complete Shopify integration"""
    print("🚀 EXECUTING XERIACO SHOPIFY INTEGRATION")
    print("=" * 50)
    
    # Test connection
    print("1. Testing Shopify connection...")
    if not test_shopify_connection(shopify_token):
        print("❌ Cannot connect to Shopify. Check token.")
        return False
    
    # Sync products
    print("\n2. Syncing products to Shopify...")
    sync_results = sync_all_products_to_shopify(shopify_token)
    
    # Success message
    successful_count = sum(1 for r in sync_results if r["result"]["success"])
    if successful_count > 0:
        print(f"\n🎉 INTEGRATION COMPLETE! {successful_count} products live!")
        print("💰 Your automated money machine is now operational!")
        return True
    else:
        print("\n❌ Integration failed. Check errors above.")
        return False

if __name__ == "__main__":
    print("⏳ Waiting for Shopify API token...")
    print("Once Ben provides token, run: execute_full_integration(token)")