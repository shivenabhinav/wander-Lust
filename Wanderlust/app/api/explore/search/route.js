import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) {
    return Response.json({ properties: [] });
  }

  // Case-insensitive regex search
  const regex = new RegExp(query, "i");

  const properties = await Property.find({
    $or: [
      { title: regex },
      { keywords: regex },
      { propertyType: regex },
      { "location.address": regex }
    ]
  });

  return Response.json({ properties }, { status: 200 });
}
