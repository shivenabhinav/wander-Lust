import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { userId } = await params;
    const today = new Date();

    let recommended = [];
    const excludedPropertyIds = new Set();

    /* --------------------------------------------------
       1️⃣ WISHLIST-BASED RECOMMENDATIONS
    -------------------------------------------------- */
    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "properties"
    );

    if (wishlist && wishlist.properties.length > 0) {
      wishlist.properties.forEach((p) =>
        excludedPropertyIds.add(p._id.toString())
      );

      const cities = wishlist.properties.map((p) => p.location.city);
      const types = wishlist.properties.map((p) => p.propertyType);

      recommended = await Property.find({
        _id: { $nin: Array.from(excludedPropertyIds) },
        $or: [
          { "location.city": { $in: cities } },
          { propertyType: { $in: types } },
        ],
        status: "approved",
      }).limit(6);

      if (recommended.length > 0) {
        return NextResponse.json(recommended);
      }
    }

    /* --------------------------------------------------
       2️⃣ BOOKING HISTORY-BASED (PAST BOOKINGS)
    -------------------------------------------------- */
    const pastBookings = await Booking.find({
      user: userId,
      checkOut: { $lt: today },
      status: "completed",
    }).populate("property");

    if (pastBookings.length > 0) {
      const cities = pastBookings.map(
        (b) => b.property.location.city
      );
      const types = pastBookings.map(
        (b) => b.property.propertyType
      );

      pastBookings.forEach((b) =>
        excludedPropertyIds.add(b.property._id.toString())
      );

      recommended = await Property.find({
        _id: { $nin: Array.from(excludedPropertyIds) },
        $or: [
          { "location.city": { $in: cities } },
          { propertyType: { $in: types } },
        ],
        status: "approved",
      }).limit(6);

      if (recommended.length > 0) {
        return NextResponse.json(recommended);
      }
    }

    /* --------------------------------------------------
       3️⃣ AMENITY-BASED MATCHING
    -------------------------------------------------- */
    const amenitiesSet = new Set();

    if (wishlist) {
      wishlist.properties.forEach((p) =>
        p.amenities.forEach((a) => amenitiesSet.add(a))
      );
    }

    pastBookings.forEach((b) =>
      b.property.amenities.forEach((a) => amenitiesSet.add(a))
    );

    if (amenitiesSet.size > 0) {
      recommended = await Property.find({
        amenities: { $in: Array.from(amenitiesSet) },
        status: "approved",
      }).limit(6);

      if (recommended.length > 0) {
        return NextResponse.json(recommended);
      }
    }

    /* --------------------------------------------------
       4️⃣ COLD START FALLBACK
    -------------------------------------------------- */

    // 4.1 Featured properties
    recommended = await Property.find({
      isFeatured: true,
      status: "approved",
    }).limit(6);

    if (recommended.length > 0) {
      return NextResponse.json(recommended);
    }

    // 4.2 Popular cities (high review count)
    recommended = await Property.find({ status: "approved" })
      .sort({ reviewsCount: -1 })
      .limit(6);

    if (recommended.length > 0) {
      return NextResponse.json(recommended);
    }

    // 4.3 High-rated properties
    recommended = await Property.find({
      ratingsAvg: { $gte: 4 },
      status: "approved",
    }).limit(6);

    if (recommended.length > 0) {
      return NextResponse.json(recommended);
    }

    // 4.4 Budget-friendly picks
    recommended = await Property.find({
      pricePerNight: { $lte: 3000 },
      status: "approved",
    }).limit(6);

    return NextResponse.json(recommended);
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { message: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
