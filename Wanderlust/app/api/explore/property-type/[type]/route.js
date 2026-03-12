import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(req, context) {
  try {
    await connectToDatabase();

    // ⭐ unwrap params safely (Next.js 14 fix)
    const params = await context.params;
    const type = params.type.toLowerCase();

    // ⭐ allowed property types
    const VALID_TYPES = {
      "villa": "Villa",
      "hotel": "Hotel",
    };

    // ⭐ validate type
    if (!VALID_TYPES[type]) {
      return Response.json(
        { message: "Invalid property type" },
        { status: 400 }
      );
    }

    const propertyTypeToSearch = VALID_TYPES[type];

    // ⭐ fetch properties by propertyType
    const properties = await Property.find({
      propertyType: propertyTypeToSearch,
    });

    return Response.json(
      {
        type: propertyTypeToSearch,
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
