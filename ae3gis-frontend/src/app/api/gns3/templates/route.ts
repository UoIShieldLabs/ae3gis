import { NextResponse } from "next/server";
import axios from "axios";

const GNS3_URL = process.env.GNS3_URL;

export async function GET() {
  try {
    const { data } = await axios.get(`${GNS3_URL}/templates`);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error fetching templates:", err.message);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
