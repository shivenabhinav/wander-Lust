import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    if (!name) {
      return Response.json({ message: "Missing category" }, { status: 400 });
    }

    // Match propertyType or keywords
    const properties = await Property.find({
      $or: [
        { propertyType: name },
        { keywords: { $in: [name.toLowerCase()] } },
      ],
    });

    return Response.json({ properties }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
