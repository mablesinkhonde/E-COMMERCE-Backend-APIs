'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Checkout() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    paymentMethod: 'credit-card',
  });
  const [error, setError] = useState('');
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.country ||
      !formData.zipCode
    ) {
      setError('Please fill in all address fields');
      return;
    }

    if (!cart || cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zipCode: formData.zipCode,
          },
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to create order');
        return;
      }

      router.push(`/orders/${data.data._id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen flex items-center justify-center">
          <p className="text-foreground text-lg">Loading checkout...</p>
        </main>
      </>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              Your cart is empty
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Continue shopping
            </Link>
          </div>
        </main>
      </>
    );
  }

  const total = cart.totalPrice + 10 + cart.totalPrice * 0.1;

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to cart
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border p-8">
                {error && (
                  <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Shipping Address
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-foreground font-medium mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          placeholder="123 Main St"
                          className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-foreground font-medium mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="New York"
                            className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-foreground font-medium mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="NY"
                            className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-foreground font-medium mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="United States"
                            className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-foreground font-medium mb-2">
                            Zip Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            placeholder="10001"
                            className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Payment Method
                    </h2>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="credit-card">Credit Card</option>
                      <option value="debit-card">Debit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="bank-transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Place Order'}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  {cart.items.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.productId?.name} x {item.quantity}
                      </span>
                      <span className="text-foreground font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-foreground">
                      ${cart.totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="text-foreground">$10.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="text-foreground">
                      ${(cart.totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex items-center justify-between font-bold">
                    <span className="text-foreground">Total:</span>
                    <span className="text-accent text-lg">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
