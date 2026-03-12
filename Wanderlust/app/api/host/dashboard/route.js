import { NextResponse } from "next/server";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { hostId } = await req.json();

    if (!hostId) {
      return NextResponse.json({ error: "Host ID required" }, { status: 400 });
    }

    // 1. Calculate Total Earnings from Properties
    // We can aggregate from Property.totalEarnings or sum up completed Bookings.
    // Using Property.totalEarnings is faster if we trust the increment logic.
    // Let's rely on the increment logic we added in verify/route.js
    const properties = await Property.find({ host: hostId });
    const totalEarnings = properties.reduce((sum, p) => sum + (p.totalEarnings || 0), 0);
    const totalProperties = properties.length;

    // 2. Fetch Bookings for this Host
    // We need to find bookings where the property belongs to this host.
    // Since we added 'host' field to Booking model, this is easy.
    const bookings = await Booking.find({ host: hostId })
      .populate("user", "name email") // Get user name
      .populate("property", "title")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;

    // Calculate earnings this month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const earningsThisMonth = bookings
      .filter(b => b.status === 'completed' && new Date(b.updatedAt) >= firstDay)
      .reduce((sum, b) => sum + (b.hostPayout || 0), 0);

    const pendingRequests = bookings.filter(b => b.status === "pending").length;

    // Format recent bookings
    const recentBookings = bookings.slice(0, 5);

    return NextResponse.json({
      totalProperties,
      totalBookings,
      totalEarnings,
      earningsThisMonth,
      pendingRequests,
      recentBookings,
      allBookings: bookings // Sending all for the /bookings page too if simplified
    });

  } catch (error) {
    console.error("Host Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
