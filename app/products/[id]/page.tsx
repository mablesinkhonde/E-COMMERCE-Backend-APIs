'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
        }
      } catch (error) {
        console.error('[v0] Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const addToCart = async () => {
    if (!product) return;

    try {
      setAdding(true);
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          quantity,
          price: product.price,
        }),
      });

      if (res.ok) {
        alert('Added to cart!');
        router.push('/cart');
      } else {
        alert('Please login to add items to cart');
        router.push('/login');
      }
    } catch (error) {
      console.error('[v0] Failed to add to cart:', error);
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen flex items-center justify-center">
          <p className="text-foreground text-lg">Loading product...</p>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen flex items-center justify-center">
          <p className="text-foreground text-lg">Product not found</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-card rounded-lg overflow-hidden border border-border">
              <img
                src={product.image || 'https://via.placeholder.com/500x500?text=Product'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-foreground">
                    {product.name}
                  </h1>
                  <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.round(product.rating)
                            ? 'fill-accent text-accent'
                            : 'text-muted-foreground'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-foreground">
                    {product.rating.toFixed(1)} ({product.reviews} reviews)
                  </span>
                </div>

                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                    <span className="text-foreground font-medium">Price:</span>
                    <span className="text-2xl font-bold text-accent">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
                    <span className="text-foreground font-medium">Stock:</span>
                    <span
                      className={`font-semibold ${
                        product.stock > 0
                          ? 'text-green-600'
                          : 'text-destructive'
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} available`
                        : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              {product.stock > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-foreground font-medium">
                      Quantity:
                    </label>
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() =>
                          setQuantity(Math.max(1, quantity - 1))
                        }
                        className="px-3 py-2 text-foreground hover:bg-muted transition-colors"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 text-foreground font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(product.stock, quantity + 1)
                          )
                        }
                        className="px-3 py-2 text-foreground hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={addToCart}
                    disabled={adding}
                    className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <ShoppingCart size={20} />
                    {adding ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
