import { NextResponse } from "next/server";
import Coupon from "@/models/Coupon";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { totalAmount, nights, category, isFirstBooking } =
      await req.json();

    const coupons = await Coupon.find({ active: true });

    const result = coupons.map((c) => {
      let eligible = true;
      const reasons = [];

      if (totalAmount < c.minAmount) {
        eligible = false;
        reasons.push(`Minimum booking ₹${c.minAmount}`);
      }

      if (nights < c.minNights) {
        eligible = false;
        reasons.push(`Minimum ${c.minNights} nights`);
      }

      if (
        c.categories.length > 0 &&
        !c.categories.includes(category)
      ) {
        eligible = false;
        reasons.push("Not valid for this property type");
      }

      if (c.firstBookingOnly && !isFirstBooking) {
        eligible = false;
        reasons.push("Only for first booking");
      }

      return {
        code: c.code,
        title: c.title,
        description: c.description,
        eligible,
        reasons,
      };
    });

    return NextResponse.json({ coupons: result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load coupons" },
      { status: 500 }
    );
  }
}