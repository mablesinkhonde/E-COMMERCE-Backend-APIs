'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-center text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Login to your account
            </p>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-foreground font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={20}
                    className="absolute left-3 top-3 text-muted-foreground"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-3 top-3 text-muted-foreground"
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-6"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-primary font-medium hover:text-accent transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
