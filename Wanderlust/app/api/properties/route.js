import { NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User"; // assuming you have a User model

// GET /api/properties?hostId=xxxx
export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const hostId = searchParams.get("hostId");

    if (!hostId) {
      return NextResponse.json({ error: "Host ID is required" }, { status: 400 });
    }

    const properties = await Property.find({ host: hostId });
    return NextResponse.json({ properties });
  } catch (err) {
    console.error("Error fetching properties:", err);
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}
