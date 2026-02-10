#!/usr/bin/env python3
"""
Generate Shopify-compatible CSV for product import
"""
import json
import requests
import csv
from datetime import datetime

API_BASE = "https://xeriaco.up.railway.app/api"
ADMIN_HEADERS = {"X-Admin-Password": "xeriaco2026", "Content-Type": "application/json"}

def get_products():
    """Get all products from Railway API"""
    try:
        response = requests.get(f"{API_BASE}/products", headers=ADMIN_HEADERS, timeout=10)
        return response.json()["products"]
    except Exception as e:
        print(f"Error getting products: {e}")
        return []

def generate_shopify_csv():
    """Generate CSV file for Shopify bulk import"""
    products = get_products()
    
    if not products:
        print("No products found")
        return
    
    # Shopify CSV headers
    headers = [
        'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Type', 'Tags',
        'Published', 'Option1 Name', 'Option1 Value', 'Variant SKU',
        'Variant Grams', 'Variant Inventory Tracker', 'Variant Inventory Qty',
        'Variant Inventory Policy', 'Variant Fulfillment Service',
        'Variant Price', 'Variant Compare At Price', 'Variant Requires Shipping',
        'Variant Taxable', 'Image Src', 'Image Position', 'Image Alt Text',
        'Gift Card', 'SEO Title', 'SEO Description', 'Google Shopping / Google Product Category',
        'Google Shopping / Gender', 'Google Shopping / Age Group', 'Google Shopping / MPN',
        'Google Shopping / AdWords Grouping', 'Google Shopping / AdWords Labels',
        'Google Shopping / Condition', 'Google Shopping / Custom Product',
        'Google Shopping / Custom Label 0', 'Google Shopping / Custom Label 1',
        'Google Shopping / Custom Label 2', 'Google Shopping / Custom Label 3',
        'Google Shopping / Custom Label 4', 'Variant Image', 'Variant Weight Unit',
        'Variant Tax Code', 'Cost per item', 'Status'
    ]
    
    csv_filename = '/root/clawd/xeriaco-shopify-import.csv'
    
    with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(headers)
        
        for product in products:
            # Create handle from title
            handle = product['title'].lower().replace(' ', '-').replace('&', 'and')
            handle = ''.join(c for c in handle if c.isalnum() or c in '-_')
            
            row = [
                handle,  # Handle
                product['title'],  # Title
                product['description'],  # Body (HTML)
                product.get('vendor', 'XeriaCO'),  # Vendor
                product.get('category', 'Electronics'),  # Type
                ', '.join(product.get('tags', [])),  # Tags
                'TRUE',  # Published
                'Title',  # Option1 Name
                'Default Title',  # Option1 Value
                f"XER-{product['_id'][:8]}",  # Variant SKU
                '0',  # Variant Grams
                'shopify',  # Variant Inventory Tracker
                '100',  # Variant Inventory Qty
                'deny',  # Variant Inventory Policy
                'manual',  # Variant Fulfillment Service
                f"{product['sellingPriceAud']:.2f}",  # Variant Price
                f"{product.get('comparePriceAud', 0):.2f}",  # Variant Compare At Price
                'TRUE',  # Variant Requires Shipping
                'TRUE',  # Variant Taxable
                product.get('featuredImage', ''),  # Image Src
                '1',  # Image Position
                product['title'],  # Image Alt Text
                'FALSE',  # Gift Card
                product['title'],  # SEO Title
                product['description'][:160],  # SEO Description (truncated)
                '',  # Google Shopping / Google Product Category
                '',  # Google Shopping / Gender
                '',  # Google Shopping / Age Group
                '',  # Google Shopping / MPN
                '',  # Google Shopping / AdWords Grouping
                '',  # Google Shopping / AdWords Labels
                'new',  # Google Shopping / Condition
                'FALSE',  # Google Shopping / Custom Product
                '',  # Google Shopping / Custom Label 0
                '',  # Google Shopping / Custom Label 1
                '',  # Google Shopping / Custom Label 2
                '',  # Google Shopping / Custom Label 3
                '',  # Google Shopping / Custom Label 4
                '',  # Variant Image
                'lb',  # Variant Weight Unit
                '',  # Variant Tax Code
                f"{product['costUsd']:.2f}",  # Cost per item
                'active'  # Status
            ]
            
            writer.writerow(row)
    
    print(f"✅ CSV generated: {csv_filename}")
    print(f"📦 {len(products)} products ready for Shopify import")
    
    # Calculate totals
    total_profit = sum(p.get('profitAud', 0) for p in products)
    avg_margin = sum(p.get('profitMarginPercent', 0) for p in products) / len(products) if products else 0
    
    print(f"💰 Total Profit Potential: ${total_profit:.2f} AUD")
    print(f"📈 Average Margin: {avg_margin:.1f}%")
    
    return csv_filename

def generate_manual_upload_guide():
    """Generate manual upload guide with copy-paste data"""
    products = get_products()
    
    guide_filename = '/root/clawd/xeriaco-manual-upload-guide.md'
    
    with open(guide_filename, 'w') as f:
        f.write("# XeriaCO Manual Product Upload Guide\n\n")
        f.write("Copy and paste these optimized product details directly into Shopify:\n\n")
        
        for i, product in enumerate(products, 1):
            profit = product.get('profitAud', 0)
            margin = product.get('profitMarginPercent', 0)
            
            f.write(f"## Product {i}: {product['title']}\n\n")
            f.write(f"**💰 Profit per sale: ${profit:.2f} AUD ({margin:.1f}% margin)**\n\n")
            f.write("### Title\n")
            f.write(f"```\n{product['title']}\n```\n\n")
            f.write("### Description\n")
            f.write(f"```\n{product['description']}\n```\n\n")
            f.write("### Pricing\n")
            f.write(f"- **Price**: ${product['sellingPriceAud']:.2f} AUD\n")
            f.write(f"- **Compare at price**: ${product.get('comparePriceAud', 0):.2f} AUD\n")
            f.write(f"- **Cost**: ${product['costUsd']:.2f} USD\n\n")
            f.write("### Category & Tags\n")
            f.write(f"- **Product type**: {product.get('category', 'Electronics')}\n")
            f.write(f"- **Tags**: {', '.join(product.get('tags', []))}\n")
            f.write(f"- **Vendor**: {product.get('vendor', 'XeriaCO')}\n\n")
            f.write("### Images\n")
            f.write(f"```\n{product.get('featuredImage', 'No image')}\n```\n\n")
            f.write("### Inventory\n")
            f.write("- **SKU**: XER-" + product['_id'][:8] + "\n")
            f.write("- **Inventory**: 100 units\n")
            f.write("- **Shipping**: Required\n\n")
            f.write("---\n\n")
    
    print(f"✅ Manual guide generated: {guide_filename}")
    return guide_filename

if __name__ == "__main__":
    print("🚀 Generating Shopify integration files...")
    csv_file = generate_shopify_csv()
    guide_file = generate_manual_upload_guide()
    print("✅ All files ready for Shopify integration!")