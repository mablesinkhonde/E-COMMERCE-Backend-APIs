'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft, Package, LogOut } from 'lucide-react';

export default function Account() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('[v0] Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen flex items-center justify-center">
          <p className="text-foreground text-lg">Loading account...</p>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="bg-background min-h-screen flex items-center justify-center">
          <p className="text-foreground text-lg">Please log in</p>
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
            Back to shopping
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-card rounded-lg border border-border p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {user.name}
                </h1>
                <p className="text-muted-foreground mb-6">{user.email}</p>
                <div className="text-sm text-muted-foreground mb-6 capitalize">
                  Role: {user.role}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-destructive text-destructive-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                {/* Account Details */}
                <div className="bg-card rounded-lg border border-border p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Account Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Full Name
                      </p>
                      <p className="text-lg text-foreground font-medium">
                        {user.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Email Address
                      </p>
                      <p className="text-lg text-foreground font-medium">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Account Type
                      </p>
                      <p className="text-lg text-foreground font-medium capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-lg border border-border p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <Link
                      href="/orders"
                      className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors group"
                    >
                      <Package
                        size={24}
                        className="text-primary group-hover:text-accent transition-colors"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          View Orders
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Check your order history
                        </p>
                      </div>
                    </Link>
                    <Link
                      href="/cart"
                      className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors group"
                    >
                      <Package
                        size={24}
                        className="text-primary group-hover:text-accent transition-colors"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          View Cart
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Continue shopping
                        </p>
                      </div>
                    </Link>
                    <Link
                      href="/"
                      className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors group"
                    >
                      <Package
                        size={24}
                        className="text-primary group-hover:text-accent transition-colors"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          Browse Products
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Explore our catalog
                        </p>
                      </div>
                    </Link>
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
