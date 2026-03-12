import Wishlist from "@/models/Wishlist";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { userId, propertyId } = await req.json();

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        properties: [propertyId]
      });
    } else {
      await Wishlist.findByIdAndUpdate(wishlist._id, {
        $addToSet: { properties: propertyId },
      });
    }

    return Response.json({ success: true, message: "Added to wishlist" });
  } catch (e) {
    return Response.json({ message: e.message }, { status: 500 });
  }
}
