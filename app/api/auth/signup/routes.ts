import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { signToken, setTokenCookie } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Signup request received');
    
    await connectDB();
    console.log('[v0] Database connected');

    const { name, email, password, confirmPassword } = await request.json();
    console.log('[v0] Request body parsed:', { name, email });

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create user
    console.log('[v0] Creating new user');
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log('[v0] User created:', user._id);

    // Generate token
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
    });
    console.log('[v0] Token generated');

    // Set token in cookies and create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );

    // Set cookie on response
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    await setTokenCookie(token);
    console.log('[v0] Token cookie set');

    return response;
  } catch (error: any) {
    console.error('[v0] Signup error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}
