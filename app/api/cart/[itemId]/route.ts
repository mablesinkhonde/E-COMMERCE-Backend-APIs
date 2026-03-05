import { connectDB } from '@/lib/mongodb';
import Cart from '@/lib/models/Cart';
import { getUserIdFromToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

// REMOVE item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: 'Cart not found' },
        { status: 404 }
      );
    }

    cart.items = cart.items.filter(
      (item: any) => item._id.toString() !== params.itemId
    );

    await cart.save();
    await cart.populate('items.productId');

    return NextResponse.json(
      { success: true, data: cart },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to remove item' },
      { status: 500 }
    );
  }
}

// UPDATE item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    await connectDB();

    const userId = await getUserIdFromToken();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { quantity } = await request.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, message: 'Invalid quantity' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: 'Cart not found' },
        { status: 404 }
      );
    }

    const item = cart.items.find(
      (item: any) => item._id.toString() === params.itemId
    );

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Item not found in cart' },
        { status: 404 }
      );
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate('items.productId');

    return NextResponse.json(
      { success: true, data: cart },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update item' },
      { status: 500 }
    );
  }
}
