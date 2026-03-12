import { razorpay } from "@/lib/razorpay";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request) {
  await connectToDatabase();

  const { amount, currency = "INR", receipt } = await request.json();

  const options = {
    amount: amount * 100, // convert to paise
    currency,
    receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    return Response.json({ order });
  } catch (err) {
    return Response.json(
      { message: "Order creation failed", error: err.message },
      { status: 500 }
    );
  }
}
