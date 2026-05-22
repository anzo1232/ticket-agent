import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  try {
    const res = await fetch('http://178.105.156.74:3001/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ success: false, error: 'VPS unreachable' }, { status: 502 });
  }
}
