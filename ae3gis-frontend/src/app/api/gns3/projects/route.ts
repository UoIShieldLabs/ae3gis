import { NextResponse } from "next/server";
import axios from "axios";

// Update this with your GNS3 server IP and port
const GNS3_URL = process.env.GNS3_URL;

export async function GET() {
  try {
    const response = await axios.get(`${GNS3_URL}/projects`);
    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
