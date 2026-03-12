// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import { connectToDatabase } from "@/lib/mongodb";
// import Booking from "@/models/Booking";

// export async function GET(req, { params }) {
//   try {
//     await connectToDatabase();

//     const userId = params.id;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return NextResponse.json(
//         { error: "Invalid User ID" },
//         { status: 400 }
//       );
//     }

//     // 📅 Start of today
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const bookings = await Booking.find({
//       user: userId,
//       status: { $in: ["confirmed", "completed"] },
//       checkIn: { $gte: today }
//     })
//       .populate("property")
//       .sort({ checkIn: 1 });

//     return NextResponse.json({
//       success: true,
//       bookings
//     });

//   } catch (error) {
//     console.error("Fetch Upcoming Trips Error:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch bookings" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id: userId } = await params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid User ID" },
        { status: 400 }
      );
    }

    // 📅 Start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { searchParams } = new URL(req.url);
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

    // 🎯 DATABASE DOES THE FILTERING
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
      { error: "Failed to fetch upcoming trips" },
      { status: 500 }
    );
  }
}
