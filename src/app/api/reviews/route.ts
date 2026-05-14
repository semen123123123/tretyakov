import { NextRequest, NextResponse } from 'next/server';
import { getReviews, createReview, updateReview, deleteReview } from '@/lib/admin-store';

export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const review = await createReview(body);
    return NextResponse.json(review);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const updated = await updateReview(id, data);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const ok = await deleteReview(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
