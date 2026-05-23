export async function POST(request) {
  const body = await request.json();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);
  try {
    const res = await fetch('http://178.105.156.74:3001/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email, password: body.password, member_id: body.member_id }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    clearTimeout(timeout);
    const msg = e.name === 'AbortError' ? 'Sync timed out' : 'Sync server unreachable';
    return Response.json({ success: false, error: msg }, { status: 502 });
  }
}
