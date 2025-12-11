import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, description, scenario } = body;
    const { id } = params;

    const AE3GIS_URL = process.env.AE3GIS_URL;
    if (!AE3GIS_URL) {
      throw new Error("AE3GIS_URL environment variable is not set");
    }

    if (!name || !description) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const response = await fetch(`${AE3GIS_URL}/topologies/${id}`, {
      method: "PUT",
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
    console.error("Update topology error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
