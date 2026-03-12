// app/api/bookings/create/route.js
import { razorpay } from "@/lib/razorpay";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { propertyId, user, checkIn, checkOut, amount, guests } = await req.json();

    const property = await Property.findById(propertyId);
    if (!property)
      return Response.json({ message: "Property not found" }, { status: 404 });

    const nights =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    if (nights <= 0)
      return Response.json(
        { message: "Invalid date range" },
        { status: 400 }
      );

    const guestsNum = parseInt(guests) || 1;
    const nightlyPrice = property.pricePerNight;

    // Use the amount passed from frontend (which includes discounts)
    const finalAmount = parseFloat(amount);

    if (isNaN(finalAmount) || finalAmount <= 0) {
      return Response.json({ message: "Invalid amount provided" }, { status: 400 });
    }

    console.log(`Booking Create: Property=${propertyId}, FinalAmount=${finalAmount}`);

    // Create Razorpay order
    const options = {
      amount: Math.round(finalAmount * 100), // Ensure it's an integer for Razorpay (paise)
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Create Booking - PENDING STATE
    const booking = await Booking.create({
      user,
      property: propertyId,
      host: property.host,
      checkIn,
      checkOut,
      guests: guestsNum,
      nightlyPrice,
      totalPrice: finalAmount, // Store the final amount after discount
      paymentStatus: "pending",
      status: "pending",
      razorpayOrderId: order.id,
    });

    return Response.json({
      success: true,
      order,
      bookingId: booking._id,
    });
  } catch (err) {
    console.error("Booking Create Error:", err);
    return Response.json({ message: err.message }, { status: 500 });
  }
}
