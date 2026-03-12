import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req) {
  try {
    await connectToDatabase();

    const {
      code,
      totalAmount,
      nights,
      category,
      isFirstBooking,
    } = await req.json();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      active: true,
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon" },
        { status: 400 }
      );
    }

    if (totalAmount < coupon.minAmount) {
      return NextResponse.json(
        { error: `Minimum booking ₹${coupon.minAmount}` },
        { status: 400 }
      );
    }

    if (nights < coupon.minNights) {
      return NextResponse.json(
        { error: `Minimum ${coupon.minNights} nights required` },
        { status: 400 }
      );
    }

    if (
      coupon.categories.length > 0 &&
      !coupon.categories.includes(category)
    ) {
      return NextResponse.json(
        { error: "Not valid for this property type" },
        { status: 400 }
      );
    }

    if (coupon.firstBookingOnly && !isFirstBooking) {
      return NextResponse.json(
        { error: "Only for first booking" },
        { status: 400 }
      );
    }

    // ✅ DISCOUNT CALCULATION (THIS IS THE KEY)
    let discount = 0;

    if (coupon.discountType === "PERCENT") {
      discount = Math.round((coupon.value / 100) * totalAmount);
    }

    if (coupon.discountType === "FLAT") {
      discount = coupon.value;
    }

    const finalAmount = Math.max(totalAmount - discount, 0);

    return NextResponse.json({
      discount,
      finalAmount,
    });

  } catch (err) {
    console.error("Coupon validation error:", err);
    return NextResponse.json(
      { error: "Coupon validation failed" },
      { status: 500 }
    );
  }
}