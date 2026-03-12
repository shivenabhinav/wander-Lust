import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import mongoose from "mongoose";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { userId, propertyId } = await req.json();

        if (!userId || !propertyId) {
            return NextResponse.json({ error: "Missing userId or propertyId" }, { status: 400 });
        }

        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            // Create new wishlist if it doesn't exist
            wishlist = await Wishlist.create({
                user: userId,
                properties: [propertyId]
            });
            return NextResponse.json({ success: true, action: "added", message: "Added to wishlist" });
        }

        // Toggle logic: Check if property already exists in wishlist
        const propertyExists = wishlist.properties.some(id => id.toString() === propertyId);

        if (propertyExists) {
            // Remove it
            await Wishlist.findByIdAndUpdate(wishlist._id, {
                $pull: { properties: propertyId }
            });
            return NextResponse.json({ success: true, action: "removed", message: "Removed from wishlist" });
        } else {
            // Add it
            await Wishlist.findByIdAndUpdate(wishlist._id, {
                $addToSet: { properties: propertyId }
            });
            return NextResponse.json({ success: true, action: "added", message: "Added to wishlist" });
        }

    } catch (error) {
        console.error("Wishlist toggle error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
