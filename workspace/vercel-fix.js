// EMERGENCY FIX: XeriaCo Frontend Connection
// Deploy this to xeriacofinal.vercel.app

import { useState, useEffect } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://xeria-378.myshopify.com/products.json');
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">XeriaCo</h1>
          <p>Loading premium products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">XeriaCo</h1>
          <p className="text-sm">Premium Products • Fast AU Shipping</p>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-5xl font-bold mb-6">Trending Products</h2>
          <p className="text-xl mb-8">Join 40,000+ satisfied customers across Australia</p>
          <div className="flex justify-center space-x-4">
            <span className="bg-green-500 px-4 py-2 rounded">✅ 30-Day Returns</span>
            <span className="bg-blue-500 px-4 py-2 rounded">🚚 Fast AU Shipping</span>
            <span className="bg-purple-500 px-4 py-2 rounded">⭐ 5-Star Rated</span>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all">
                <img 
                  src={product.images[0]?.src} 
                  alt={product.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{product.title}</h3>
                  
                  <div className="flex items-center mb-4">
                    <span className="text-3xl font-bold text-green-400">
                      ${product.variants[0].price}
                    </span>
                    {product.variants[0].compare_at_price && (
                      <span className="text-lg text-gray-400 line-through ml-3">
                        ${product.variants[0].compare_at_price}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                      🔥 LIMITED TIME
                    </span>
                  </div>

                  <a 
                    href={`https://xeria-378.myshopify.com/products/${product.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors block text-center"
                  >
                    GET YOURS NOW →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto text-center px-4">
          <h3 className="text-3xl font-bold mb-8">Trusted by Australians</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-400">40,000+</div>
              <p>Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400">4.9★</div>
              <p>Average Rating</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">10-15</div>
              <p>Day Delivery</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400">30</div>
              <p>Day Returns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 text-center">
        <p className="text-gray-400">© 2026 XeriaCo - Premium Products, Premium Service</p>
      </div>
    </div>
  );
}