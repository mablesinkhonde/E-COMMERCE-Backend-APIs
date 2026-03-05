'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCart(data.data);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('[v0] Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setUpdatingItems((prev) => new Set(prev).add(itemId));
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setCart(data.data);
      }
    } catch (error) {
      console.error('[v0] Failed to remove item:', error);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      setUpdatingItems((prev) => new Set(prev).add(itemId));
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCart(data.data);
      }
    } catch (error) {
      console.error('[v0] Failed to update quantity:', error);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen flex items-center justify-center">
          <p className="text-foreground text-lg">Loading cart...</p>
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
            Continue shopping
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8">
            Shopping Cart
          </h1>

          {!cart || cart.items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                Your cart is empty
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  {cart.items.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-6 border-b border-border last:border-b-0"
                    >
                      <img
                        src={
                          item.productId?.image ||
                          'https://via.placeholder.com/100x100?text=Product'
                        }
                        alt={item.productId?.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {item.productId?.name}
                        </h3>
                        <p className="text-muted-foreground">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 border border-border rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={updatingItems.has(item._id)}
                          className="px-3 py-2 text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 text-foreground font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          disabled={updatingItems.has(item._id)}
                          className="px-3 py-2 text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id)}
                        disabled={updatingItems.has(item._id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="text-foreground font-medium">
                        ${cart.totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span className="text-foreground font-medium">
                        $10.00
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax:</span>
                      <span className="text-foreground font-medium">
                        ${(cart.totalPrice * 0.1).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">Total:</span>
                      <span className="font-bold text-accent text-lg">
                        ${(
                          cart.totalPrice +
                          10 +
                          cart.totalPrice * 0.1
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-accent text-accent-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
