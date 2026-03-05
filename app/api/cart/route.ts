import { connectDB } from '@/lib/mongodb';
import Cart from '@/lib/models/Cart';
import { getUserIdFromToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

// GET user cart
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
        totalPrice: 0,
      });
    }

    return NextResponse.json(
      { success: true, data: cart },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// ADD item to cart or UPDATE quantity
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { productId, quantity, price } = await request.json();

    if (!productId || !quantity || !price) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity, price }],
      });
    } else {
      // Check if item exists
      const existingItem = cart.items.find(
        (item: any) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, price });
      }
    }

    await cart.save();
    await cart.populate('items.productId');

    return NextResponse.json(
      { success: true, data: cart },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// CLEAR cart
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items: [], totalPrice: 0 },
      { new: true }
    );

    return NextResponse.json(
      { success: true, data: cart },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
