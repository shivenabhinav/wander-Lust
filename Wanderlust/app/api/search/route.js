import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("query") || "";

  if (!q.trim()) {
    return Response.json({ properties: [] });
  }

  const regex = new RegExp(q, "i"); // case-insensitive

  const properties = await Property.find({
    $or: [
      { title: regex },
      { keywords: regex },
      { propertyType: regex },
      { "location.address": regex },
    ],
  });

  return Response.json({ properties });
}
