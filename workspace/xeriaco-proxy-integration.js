// XeriaCo Backend Proxy Integration
// Proxies cart requests to our local cart API service
// This allows the existing backend to handle cart functionality

const http = require('http');
const https = require('https');
const url = require('url');

// Cart API proxy middleware
function createCartProxy() {
    return (req, res) => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // Handle preflight OPTIONS requests
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        const parsedUrl = url.parse(req.url, true);
        
        // Only proxy cart-related requests
        if (!parsedUrl.pathname.startsWith('/api/cart') && parsedUrl.pathname !== '/api/checkout') {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Not found', path: parsedUrl.pathname }));
            return;
        }
        
        // Proxy to local cart API
        const proxyOptions = {
            hostname: 'localhost',
            port: 3001,
            path: parsedUrl.pathname + (parsedUrl.search || ''),
            method: req.method,
            headers: {
                ...req.headers,
                'host': 'localhost:3001'
            }
        };
        
        const proxyReq = http.request(proxyOptions, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });
        
        proxyReq.on('error', (err) => {
            console.error('Proxy error:', err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Proxy error', details: err.message }));
        });
        
        // Forward request body for POST/PUT requests
        if (req.method === 'POST' || req.method === 'PUT') {
            req.pipe(proxyReq);
        } else {
            proxyReq.end();
        }
    };
}

// Create proxy server
const proxy = createCartProxy();
const server = http.createServer(proxy);

const PORT = process.env.PROXY_PORT || 3002;

server.listen(PORT, () => {
    console.log(`XeriaCo Cart Proxy running on port ${PORT}`);
    console.log(`Forwarding cart requests to localhost:3001`);
    console.log(`Frontend can now use: http://localhost:${PORT}/api/cart/*`);
});

module.exports = { createCartProxy };