// CURRENTLY WORKING VERSION:
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, templateId, x, y, name } = body;

    if (!projectId || !templateId) {
      return NextResponse.json(
        { error: "Missing projectId or templateId" },
        { status: 400 }
      );
    }
    
    const payload = {
      x,
      y,
      name,
    };

    const GNS3_URL = process.env.GNS3_URL; // e.g. http://localhost:3080/v2
    const response = await fetch(
      `${GNS3_URL}/projects/${projectId}/templates/${templateId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GNS3 API error: ${response.status} ${text}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Spawn node error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
