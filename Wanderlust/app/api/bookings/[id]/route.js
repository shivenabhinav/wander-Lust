import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Property from "@/models/Property";

export async function GET(req, { params }) {
  await connectToDatabase();

  const { id } = await params;

  const booking = await Booking.findById(id).populate("property");

  if (!booking) {
    return Response.json({ message: "Not Found" }, { status: 404 });
  }

  return Response.json(booking);
}
