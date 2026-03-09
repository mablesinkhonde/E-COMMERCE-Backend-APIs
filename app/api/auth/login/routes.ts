import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { signToken, setTokenCookie } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Login request received');
    await connectDB();
    console.log('[v0] Database connected');

    const { email, password } = await request.json();
    console.log('[v0] Login attempt for:', email);

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
    });
    console.log('[v0] Token generated for user:', user._id);

    // Create response with token
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );

    // Set cookie on response
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    await setTokenCookie(token);
    console.log('[v0] Token cookie set');

    return response;
  } catch (error: any) {
    console.error('[v0] Login error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to login' },
      { status: 500 }
    );
  }
}
