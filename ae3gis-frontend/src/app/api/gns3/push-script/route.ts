import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scripts, gns3_server_ip, concurrency } = body;

    const AE3GIS_URL = process.env.AE3GIS_URL;
    if (!AE3GIS_URL) {
      throw new Error("AE3GIS_URL environment variable is not set");
    }

    if (!scripts || !Array.isArray(scripts) || scripts.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid scripts array" },
        { status: 400 }
      );
    }

    if (!gns3_server_ip) {
      return NextResponse.json(
        { error: "Missing gns3_server_ip" },
        { status: 400 }
      );
    }

    // Forward to AE3GIS API
    const response = await fetch(`${AE3GIS_URL}/scripts/push`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scripts,
        gns3_server_ip,
        concurrency: concurrency || 5,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Script deployment error: ${response.status} ${text}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Deploy scripts error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}