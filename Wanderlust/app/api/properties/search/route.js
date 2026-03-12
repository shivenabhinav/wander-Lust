import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDatabase();

    // get search query param
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    // find properties matching title, location, or description
    const properties = await Property.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { "location.address": { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    return NextResponse.json(properties);
  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
