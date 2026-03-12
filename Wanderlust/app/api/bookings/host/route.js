import { NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Property from "@/models/Property";

export async function GET(req) {
  try {
    await connectToDatabase();

    // ✅ 1. Extract hostId from query parameters
    const { searchParams } = new URL(req.url);
    const hostId = searchParams.get("hostId");

    if (!hostId) {
      return NextResponse.json({ message: "Host ID is required" }, { status: 400 });
    }

    // ✅ 2. Find all properties owned by this host
    const hostProperties = await Property.find({ host: hostId }).select("_id");
    const propertyIds = hostProperties.map((p) => p._id);

    // ✅ 3. Find bookings where property is one of host's
    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate("property", "title pricePerNight") // property info
      .populate("user", "name email")              // guest info
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching host bookings:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
