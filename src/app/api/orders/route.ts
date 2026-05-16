import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder, updateOrderStatus, deleteOrder } from '@/lib/admin-store';

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await createOrder(body);
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 });
    const updated = await updateOrderStatus(id, status);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await deleteOrder(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
