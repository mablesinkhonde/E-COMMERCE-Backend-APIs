'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';

export default function OrderDetail({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.data);
      } else {
        router.push('/orders');
      }
    } catch (error) {
      console.error('[v0] Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen flex items-center justify-center">
          <p className="text-foreground text-lg">Loading order...</p>
        </main>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen flex items-center justify-center">
          <p className="text-foreground text-lg">Order not found</p>
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
            href="/orders"
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to orders
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Order {order._id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="border-t border-border pt-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Order Items
                  </h2>
                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                      >
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            ${item.price.toFixed(2)}
                          </p>
                          <p className="text-sm text-accent">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card rounded-lg border border-border p-8">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-2 text-foreground">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state}{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-foreground font-medium">
                      ${order.totalPrice.toFixed(2)}
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
                      ${(order.totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Total:</span>
                    <span className="font-bold text-accent text-lg">
                      ${(
                        order.totalPrice +
                        10 +
                        order.totalPrice * 0.1
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border pt-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Payment Method
                    </p>
                    <p className="font-semibold text-foreground capitalize">
                      {order.paymentMethod.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Payment Status
                    </p>
                    <p
                      className={`font-semibold capitalize ${
                        order.paymentStatus === 'completed'
                          ? 'text-green-600'
                          : order.paymentStatus === 'failed'
                            ? 'text-destructive'
                            : 'text-yellow-600'
                      }`}
                    >
                      {order.paymentStatus}
                    </p>
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
