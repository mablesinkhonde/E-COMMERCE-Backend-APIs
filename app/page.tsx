'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { ShoppingCart, Star } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = category
        ? `/api/products?category=${category}`
        : '/api/products';
      const res = await fetch(url);
      if (!res.ok) {
        console.error('[v0] API error:', res.status);
        setProducts([]);
        return;
      }
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error('[v0] Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    'Electronics',
    'Clothing',
    'Books',
    'Home',
    'Sports',
  ];

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-accent py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
              Welcome to ShopHub
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Discover amazing products across multiple categories
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Category Filter */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === 'All' ? '' : cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    (cat === 'All' && !category) ||
                    (cat !== 'All' && category === cat)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground border border-border hover:border-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-foreground text-lg">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products found in this category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                >
                  <div className="aspect-square bg-muted relative overflow-hidden group">
                    <img
                      src={product.image || 'https://via.placeholder.com/300x300?text=Product'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-accent">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star
                          size={16}
                          className="fill-accent text-accent"
                        />
                        <span className="text-sm text-foreground">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : 'Out of stock'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
