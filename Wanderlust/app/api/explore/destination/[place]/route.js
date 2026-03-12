import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(req, ctx) {
  await connectToDatabase();

  const { params } = ctx;      // ctx has params
  const { place } = await params;  // MUST await

  if (!place || typeof place !== "string") {
    return Response.json(
      { properties: [], message: "Invalid place" },
      { status: 400 }
    );
  }

  // Find properties where location.city contains the word
  const properties = await Property.find({
    "location.city": { $regex: place, $options: "i" }
  });

  return Response.json({ properties }, { status: 200 });
}
