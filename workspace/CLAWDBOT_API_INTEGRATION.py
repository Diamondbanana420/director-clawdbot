#!/usr/bin/env python3
"""
CLAWDBOT API INTEGRATION - XeriaCo Store Manager
==============================================
Complete API integration for communicating with Ben's Clawdbot AI Manager

USAGE:
1. Copy this entire file to your project
2. Import: from CLAWDBOT_API_INTEGRATION import ClawdbotAPI
3. Use: bot = ClawdbotAPI(); bot.send("Your message here")

REQUIREMENTS: pip install requests
"""

import requests
import json
from datetime import datetime
from typing import Dict, Any, Optional

class ClawdbotAPI:
    """
    Direct API integration with Ben's Clawdbot AI Manager
    Handles all communication, alerts, and automation coordination
    """
    
    def __init__(self):
        # Gateway API Configuration
        self.base_url = "http://localhost:18789"
        self.auth_token = "bf4765e62a04f87f5d339499fc25aa01"
        self.session_key = "main"
        
        # HTTP headers
        self.headers = {
            "Authorization": f"Bearer {self.auth_token}",
            "Content-Type": "application/json"
        }
    
    def send_message(self, message: str, urgent: bool = False) -> Dict[str, Any]:
        """
        Send a message directly to Clawdbot AI Manager
        
        Args:
            message (str): Message to send to the AI
            urgent (bool): If True, adds 🚨 urgent flag
            
        Returns:
            dict: API response with status and result
        """
        try:
            # Format message with timestamp and urgency
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            formatted_message = f"[{timestamp}] {'🚨 URGENT: ' if urgent else ''}{message}"
            
            # API payload
            payload = {
                "message": formatted_message,
                "sessionKey": self.session_key
            }
            
            # Send POST request
            response = requests.post(
                f"{self.base_url}/api/sessions/send",
                headers=self.headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "status_code": response.status_code,
                    "response": response.json(),
                    "message_sent": formatted_message
                }
            else:
                return {
                    "success": False,
                    "status_code": response.status_code,
                    "error": response.text,
                    "message_sent": formatted_message
                }
                
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Connection error: {str(e)}",
                "message_sent": formatted_message
            }
    
    def check_status(self) -> Dict[str, Any]:
        """Check if Clawdbot AI Manager is online and responsive"""
        try:
            response = requests.get(
                f"{self.base_url}/api/sessions/list",
                headers=self.headers,
                timeout=5
            )
            
            return {
                "online": response.status_code == 200,
                "status_code": response.status_code,
                "sessions": response.json() if response.status_code == 200 else None
            }
            
        except requests.exceptions.RequestException as e:
            return {
                "online": False,
                "error": f"Connection failed: {str(e)}"
            }
    
    def get_recent_messages(self, limit: int = 5) -> Dict[str, Any]:
        """Get recent messages from the AI Manager session"""
        try:
            response = requests.get(
                f"{self.base_url}/api/sessions/history",
                headers=self.headers,
                params={
                    "sessionKey": self.session_key,
                    "limit": limit
                },
                timeout=10
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "messages": response.json()
                }
            else:
                return {
                    "success": False,
                    "error": f"HTTP {response.status_code}: {response.text}"
                }
                
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "error": f"Connection error: {str(e)}"
            }

# ============================================================================
# XERIACO STORE INTEGRATION HELPERS
# ============================================================================

def alert_new_order(order_id: str, amount: float, customer_email: str) -> bool:
    """Alert AI Manager about new store orders"""
    bot = ClawdbotAPI()
    message = f"💰 NEW ORDER: #{order_id} for ${amount:.2f} from {customer_email}"
    result = bot.send_message(message, urgent=True)
    return result.get("success", False)

def alert_low_inventory(product_name: str, quantity: int) -> bool:
    """Alert AI Manager about low inventory"""
    bot = ClawdbotAPI()
    message = f"📦 LOW STOCK: {product_name} - Only {quantity} left in inventory"
    result = bot.send_message(message, urgent=True)
    return result.get("success", False)

def alert_system_error(error_message: str) -> bool:
    """Alert AI Manager about system errors"""
    bot = ClawdbotAPI()
    message = f"🚨 SYSTEM ERROR: {error_message}"
    result = bot.send_message(message, urgent=True)
    return result.get("success", False)

def send_daily_report(sales_count: int, revenue: float, top_product: str) -> bool:
    """Send daily sales report to AI Manager"""
    bot = ClawdbotAPI()
    message = f"📊 DAILY REPORT: {sales_count} orders, ${revenue:.2f} revenue, top seller: {top_product}"
    result = bot.send_message(message, urgent=False)
    return result.get("success", False)

def request_ai_action(action: str, details: str) -> bool:
    """Request AI Manager to perform specific action"""
    bot = ClawdbotAPI()
    message = f"🤖 ACTION REQUESTED: {action} - {details}"
    result = bot.send_message(message, urgent=False)
    return result.get("success", False)

# ============================================================================
# EXAMPLE USAGE - UNCOMMENT TO TEST
# ============================================================================

if __name__ == "__main__":
    # Test connection
    bot = ClawdbotAPI()
    status = bot.check_status()
    print(f"Clawdbot Status: {'Online' if status['online'] else 'Offline'}")
    
    # Test message
    if status['online']:
        result = bot.send_message("🧪 Test message from XeriaCo automation system")
        print(f"Message sent: {result['success']}")
    
    # Example alerts
    # alert_new_order("12345", 79.99, "customer@example.com")
    # alert_low_inventory("USB Blender", 3)
    # send_daily_report(15, 899.85, "Premium Water Bottle")

# ============================================================================
# CURL COMMANDS (if you prefer command line)
# ============================================================================

"""
# Send message via curl:
curl -X POST http://localhost:18789/api/sessions/send \
  -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  -H "Content-Type: application/json" \
  -d '{"message": "Your message here", "sessionKey": "main"}'

# Check status:
curl -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  http://localhost:18789/api/sessions/list

# Get recent messages:
curl -H "Authorization: Bearer bf4765e62a04f87f5d339499fc25aa01" \
  "http://localhost:18789/api/sessions/history?sessionKey=main&limit=5"
"""

# ============================================================================
# INTEGRATION EXAMPLES FOR COMMON XERIACO SCENARIOS
# ============================================================================

class XeriaCOAutomation:
    """
    Ready-to-use automation for common XeriaCo store scenarios
    """
    
    def __init__(self):
        self.bot = ClawdbotAPI()
    
    def shopify_order_webhook(self, order_data: Dict[str, Any]) -> None:
        """Handle Shopify order webhook"""
        order_id = order_data.get('order_number', 'Unknown')
        total = float(order_data.get('total_price', 0))
        customer = order_data.get('customer', {}).get('email', 'Unknown')
        
        # Alert AI Manager
        message = f"💰 Shopify Order: #{order_id} | ${total:.2f} | {customer}"
        self.bot.send_message(message, urgent=total > 100)
    
    def inventory_check(self, products: list) -> None:
        """Check inventory levels and alert if low"""
        for product in products:
            name = product.get('name', 'Unknown Product')
            quantity = int(product.get('quantity', 0))
            
            if quantity < 5:  # Low stock threshold
                self.bot.send_message(
                    f"📦 LOW STOCK ALERT: {name} has only {quantity} units left",
                    urgent=True
                )
    
    def competitor_price_alert(self, product: str, our_price: float, competitor_price: float) -> None:
        """Alert about competitor pricing"""
        difference = our_price - competitor_price
        if difference > 5:  # We're $5+ more expensive
            message = f"💸 PRICE ALERT: {product} - We: ${our_price:.2f} | Competitor: ${competitor_price:.2f} (${difference:.2f} higher)"
            self.bot.send_message(message, urgent=True)

# ============================================================================
# READY TO USE - JUST COPY AND PASTE THIS ENTIRE FILE!
# ============================================================================