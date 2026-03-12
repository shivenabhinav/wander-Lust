import Property from "@/models/Property";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req, { params }) {
  await connectToDatabase();

  const { id } = await params;

  const property = await Property.findById(id);

  if (!property)
    return Response.json({ message: "Not found" }, { status: 404 });

  return Response.json(property);
}
