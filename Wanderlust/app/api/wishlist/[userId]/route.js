import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { userId } = await params;
    const wishlist = await Wishlist.findOne({ user: userId })
      .populate("properties");

    if (!wishlist) {
      return NextResponse.json([]);
    }

    return NextResponse.json(wishlist.properties);
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}
