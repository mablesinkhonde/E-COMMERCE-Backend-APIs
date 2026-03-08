'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to create account');
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
              Create Account
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Join ShopHub today
            </p>

            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-foreground font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon
                    size={20}
                    className="absolute left-3 top-3 text-muted-foreground"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

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

              <div>
                <label className="block text-foreground font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={20}
                    className="absolute left-3 top-3 text-muted-foreground"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
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
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center text-muted-foreground mt-6">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary font-medium hover:text-accent transition-colors"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
