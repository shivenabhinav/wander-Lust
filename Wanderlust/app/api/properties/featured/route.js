import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET() {
  try {
    await connectToDatabase();

    const featuredProperties = await Property.find({
      isFeatured: true,
      status: "approved",
    })
      .select("title images pricePerNight ratingsAvg location.city")
    //   .limit(3);

    return NextResponse.json(featuredProperties);
  } catch (error) {
    console.error("Featured properties error:", error);
    return NextResponse.json(
      { message: "Failed to fetch featured properties" },
      { status: 500 }
    );
  }
}
