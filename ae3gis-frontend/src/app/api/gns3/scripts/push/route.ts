import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const AE3GIS_URL = process.env.AE3GIS_URL; // e.g. http://localhost:8000
    if (!AE3GIS_URL) {
      throw new Error("AE3GIS_URL environment variable is not set");
    }

    // Forward to backend API
    const response = await fetch(`${AE3GIS_URL}/scripts/push`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error: ${response.status} ${text}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Script push error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
