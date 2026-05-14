import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Logout
    if (body.action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    // Login
    if (!ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'ADMIN_PASSWORD not configured on server' }, { status: 500 });
    }

    if (body.password === ADMIN_PASSWORD) {
      const token = crypto.randomUUID();
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 4, // 4 hours
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Неверный пароль' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  // In Next.js 16, cookies() is awaited
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return NextResponse.json({ authenticated: !!session });
}
