import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Valid User ID is required" },
                { status: 400 }
            );
        }

        // 📅 Start of today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const type = searchParams.get("type");
        let filter = {
            user: userId,
            status: { $in: ["confirmed", "completed"] }
        };

        if (type === "past") {
            filter.checkOut = { $lt: today };
        } else {
            filter.checkIn = { $gte: today };
        }

        const bookings = await Booking.find(filter)
            .populate("property")
            .sort(type === "past" ? { checkOut: -1 } : { checkIn: 1 });

        return NextResponse.json({
            success: true,
            bookings
        });

    } catch (error) {
        console.error("Fetch Upcoming Trips Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
