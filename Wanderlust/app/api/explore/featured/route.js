import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET() {
  await connectToDatabase();
  const featured = await Property.find({ isFeatured: true }).limit(6);
  return Response.json({ featured });
}
