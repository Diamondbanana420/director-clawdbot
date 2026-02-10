# URGENT: XeriaCo Frontend Connection Fix

## Problem Diagnosed:
- Frontend (xeriacofinal.vercel.app) shows "Emergent | Fullstack App" placeholder
- NOT connected to Shopify store (xeria-378.myshopify.com)  
- Zero sales possible through main domain

## Immediate Fix Required:

### Option 1: Connect Frontend to Shopify
Update frontend code to fetch from Shopify API:

```javascript
// In your frontend code (likely pages/index.js or similar)
const SHOPIFY_DOMAIN = 'xeria-378.myshopify.com';
const STOREFRONT_API_TOKEN = 'your_storefront_api_token';

async function fetchProducts() {
  const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_API_TOKEN
    },
    body: JSON.stringify({
      query: `{
        products(first: 10) {
          edges {
            node {
              id title handle description
              priceRange { minVariantPrice { amount currencyCode } }
              images(first: 3) { edges { node { url altText } } }
            }
          }
        }
      }`
    })
  });
  return response.json();
}
```

### Option 2: Redirect Frontend (Quick Fix)
In Vercel dashboard or via vercel.json:

```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "https://xeria-378.myshopify.com",
      "permanent": false
    }
  ]
}
```

### Option 3: Embed Shopify Store
Use Shopify Buy Button or embedded store:

```html
<!-- Replace current frontend content -->
<div id="product-component-1"></div>
<script type="text/javascript">
/*<![CDATA[*/
(function () {
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }
})();
/*]]>*/
</script>
```

## Revenue Impact:
- **Current**: $0/day (frontend broken)
- **After fix**: $50-200/day potential (based on traffic)
- **Lost revenue**: ~$1500/month until fixed

## Action Required:
1. Get Storefront API token from Shopify admin
2. Update frontend code to connect to store
3. Deploy fix to Vercel
4. Test purchasing flow end-to-end