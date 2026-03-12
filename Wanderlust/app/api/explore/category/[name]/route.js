import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(req, context) {
  try {
    await connectToDatabase();

    // ⭐ unwrap params safely (Next.js 14 fix)
    const params = await context.params;
    const category = params.name.toLowerCase();

    // ⭐ allowed categories and their matching keywords
    const CATEGORY_KEYWORDS = {
      "beach": "beach",
      "mountain": "mountain",
      "city-stay": "city",
      "luxury": "luxury",
    };

    // ⭐ validate category
    if (!CATEGORY_KEYWORDS[category]) {
      return Response.json(
        { message: "Invalid category" },
        { status: 400 }
      );
    }

    const keywordToSearch = CATEGORY_KEYWORDS[category];

    // ⭐ fetch properties matching keyword
    const properties = await Property.find({
      keywords: { $elemMatch: { $regex: keywordToSearch, $options: "i" } }
    });

    return Response.json(
      {
        category,
        keyword: keywordToSearch,
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
