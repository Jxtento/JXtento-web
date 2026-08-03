import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // We are proxying this request from the server side to avoid CORS blocks in the browser
    const res = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      body: formData,
      headers: {
        // Must clear Host/Origin headers or keep them default so pump.fun accepts it
      }
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => res.statusText);
      console.error("[Pumpfun Proxy] Upload failed:", res.status, errText);
      return NextResponse.json({ error: `Pump.fun upload failed: ${errText || res.statusText}` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Pumpfun Proxy] Server error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
