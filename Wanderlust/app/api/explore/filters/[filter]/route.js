import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(req, context) {
  try {
    await connectToDatabase();

    // ⭐ Unwrap dynamic params (Next.js 14 fix)
    const params = await context.params;
    const filter = params.filter.toLowerCase();

    let query = {};

    // ============================
    // ⭐ BUDGET FILTER (< 10000)
    // ============================
    if (filter === "budget") {
      query = { pricePerNight: { $lt: 10000 } };
    }

    // ============================
    // ⭐ TRENDING FILTER (created within last 30 days)
    // ============================
    else if (filter === "trending") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      query = { createdAt: { $gte: thirtyDaysAgo } };
    }

    // ============================
    // ❌ Invalid filter
    // ============================
    else {
      return Response.json(
        { message: "Invalid filter type" },
        { status: 400 }
      );
    }

    // ============================
    // ⭐ Fetch filtered properties
    // ============================
    const properties = await Property.find(query).sort({ createdAt: -1 });

    return Response.json(
      {
        filter,
        count: properties.length,
        properties,
      },
      { status: 200 }
    );

  } catch (error) {
    return Response.json(
      {
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
