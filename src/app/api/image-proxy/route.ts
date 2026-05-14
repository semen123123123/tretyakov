import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    if (!url) return NextResponse.json({ error: 'Missing url param' }, { status: 400 });

    // Only allow Supabase storage URLs
    if (!url.startsWith('https://owqzkqmjiiqzdmgjkrzm.supabase.co/storage/')) {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
    }

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Upstream error: ${response.status}`);

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('Image proxy error:', err);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
