import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // already built from frontend
    const { name, description, scenario } = body;

    const AE3GIS_URL = process.env.AE3GIS_URL; // e.g. http://localhost:8000
    if (!AE3GIS_URL) {
      throw new Error("AE3GIS_URL environment variable is not set");
    }

    if (!name || !description) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Forward to GNS3 API
    const response = await fetch(`${AE3GIS_URL}/topologies/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, scenario }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GNS3 API error: ${response.status} ${text}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Send topology error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
