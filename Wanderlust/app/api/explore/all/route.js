import { connectToDatabase } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET() {
  await connectToDatabase();
  const properties = await Property.find().limit(30);
  return Response.json({ properties });
}
