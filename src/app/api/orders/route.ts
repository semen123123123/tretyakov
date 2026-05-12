import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { customer_name, customer_email, customer_phone, delivery_address, total_amount, items } = body;

    // Generate order number
    const orderNumber = `TR${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Insert order
    const { data, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        total_amount,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    // Insert order items
    if (items && items.length > 0 && data) {
      for (const item of items) {
        await supabase.from('order_items').insert({
          order_id: data.id,
          product_id: item.product_id,
          stone_ids: item.stone_ids || [],
          quantity: item.quantity,
          unit_price: item.unit_price,
        });
      }
    }

    return NextResponse.json({ success: true, order: data });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ orders: data || [] });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}