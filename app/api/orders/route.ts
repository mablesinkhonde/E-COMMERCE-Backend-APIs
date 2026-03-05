import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Cart from '@/lib/models/Cart';
import { getUserIdFromToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

// GET user orders
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

    const orders = await Order.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: orders },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// CREATE order from cart
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

    const {
      shippingAddress,
      paymentMethod,
    } = await request.json();

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Create order
    const orderItems = cart.items.map((item: any) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      userId,
      items: orderItems,
      totalPrice: cart.totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'pending',
    });

    // Clear cart
    await Cart.updateOne({ userId }, { items: [], totalPrice: 0 });

    await order.populate('items.productId');

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
