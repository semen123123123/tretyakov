import { NextRequest, NextResponse } from 'next/server';
import { getStones, createStone, updateStone, deleteStone } from '@/lib/admin-store';

export async function GET() {
  const stones = await getStones();
  return NextResponse.json(stones);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const stone = await createStone(body);
    return NextResponse.json(stone);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create stone' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const updated = await updateStone(id, data);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update stone' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const ok = await deleteStone(id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
