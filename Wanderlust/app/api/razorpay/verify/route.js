// app/api/razorpay/verify/route.js
import crypto from "crypto";
import Booking from "@/models/Booking";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    return Response.json({ success: false }, { status: 400 });
  }

  // Update booking
  await Booking.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      paymentStatus: "paid",
      status: "confirmed",
      razorpayPaymentId: razorpay_payment_id,
    }
  );

  return Response.json({ success: true });
}
