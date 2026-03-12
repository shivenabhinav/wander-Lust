import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    console.log("📌 Incoming Body:", body);

    const {
      title,
      description,
      pricePerNight,
      location,
      amenities,
      images,
      maxGuests,
      hostId,
      keywords = [],
      propertyType,
      isFeatured = false,
      bedrooms = 1,
      bathrooms = 1,
      size = 0,
      blockedDates = [],
    } = body;

    // ⭐ Required field validation
    if (!hostId) {
      return NextResponse.json({ message: "Host ID required" }, { status: 400 });
    }

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (!pricePerNight) missingFields.push("pricePerNight");
    if (!location) missingFields.push("location");
    if (!propertyType) missingFields.push("propertyType");
    if (!images || images.length === 0) missingFields.push("images");

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }
    if (!propertyType) {
      return NextResponse.json(
        { message: "Property type required" },
        { status: 400 }
      );
    }

    // ⭐ SANITIZE blockedDates (0, 1 or many allowed)
    const formattedBlockedDates = (blockedDates || [])
      .filter((d) => d.start && d.end) // remove bad entries
      .map((d) => ({
        start: new Date(d.start),
        end: new Date(d.end),
      }));

    console.log("📌 Final Blocked Dates:", formattedBlockedDates);

    // ⭐ Create property
    const property = await Property.create({
      host: new mongoose.Types.ObjectId(hostId),
      title,
      description,
      pricePerNight: Number(pricePerNight),
      location,
      amenities,
      images,
      maxGuests: Number(maxGuests),
      keywords,
      propertyType,
      isFeatured,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      size: Number(size),
      blockedDates: formattedBlockedDates, // allowed: []
    });

    return NextResponse.json(
      {
        message: "Property added successfully!",
        property,
      },
      { status: 201 }
    );

  } catch (err) {
    console.error("🔥 Error adding property:", err);
    return NextResponse.json(
      { message: "Error adding property", error: err.message },
      { status: 500 }
    );
  }
}
