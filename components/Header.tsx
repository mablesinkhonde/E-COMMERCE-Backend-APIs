'use client';

import Link from 'next/link';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.log('[v0] Not authenticated');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          ShopHub
        </Link>

        <div className="flex-1 mx-8">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-sm px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart size={24} />
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/account"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <User size={24} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-foreground hover:text-destructive transition-colors"
                  >
                    <LogOut size={24} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-foreground hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
