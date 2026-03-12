import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, context) {
  try {
    await connectToDatabase();

    const { id } = await context.params; // ✅ FIX: await params

    const user = await User.findById(id).select("name email");

    if (!user) {
      return Response.json({ message: "Host not found" }, { status: 404 });
    }

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching host:", error);
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
