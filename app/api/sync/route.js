import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  try {
    const res = await fetch('https://exclude-unjustly-evacuate.ngrok-free.dev/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': '1' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Sync server unreachable' }, { status: 502 });
  }
}
