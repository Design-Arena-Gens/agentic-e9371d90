export async function POST(request: Request) {
  try {
    const body = await request.json();
    return new Response(
      JSON.stringify({ ok: true, receivedAt: new Date().toISOString(), body }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ ok: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
