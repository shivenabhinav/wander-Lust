import { NextResponse } from "next/server";
import Booking from "@/models/Booking";
import Property from "@/models/Property";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { bookingId, razorpayPaymentId } = await req.json();

        if (!bookingId || !razorpayPaymentId) {
            return NextResponse.json(
                { error: "Missing Booking ID or Payment ID" },
                { status: 400 }
            );
        }

        const booking = await Booking.findById(bookingId).populate("property");
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Double check if already paid to prevent double accounting
        if (["confirmed", "completed"].includes(booking.status) || booking.paymentStatus === "paid") {
            return NextResponse.json({
                success: true,
                message: "Booking already confirmed",
                receipt: generateReceipt(booking, booking.property, booking.hostPayout, booking.platformFee)
            });
        }

        // 1. Calculate Revenue Split (25% Platform / 75% Host)
        const totalPrice = booking.totalPrice;
        const platformFee = totalPrice * 0.25;
        const hostPayout = totalPrice - platformFee;

        // 2. Update Booking
        booking.paymentStatus = "paid";
        booking.status = "confirmed";
        booking.razorpayPaymentId = razorpayPaymentId;
        booking.platformFee = platformFee;
        booking.hostPayout = hostPayout; // Saved for record

        await booking.save();

        // 3. Update Host Earnings
        await Property.findByIdAndUpdate(booking.property._id, {
            $inc: { totalEarnings: hostPayout },
        });

        console.log(`Booking Verified: ID=${bookingId}, Split=${platformFee}/${hostPayout}`);

        // 4. Generate Receipt
        const receipt = generateReceipt(booking, booking.property, hostPayout, platformFee);

        return NextResponse.json({
            success: true,
            receipt,
        });

    } catch (error) {
        console.error("Booking Verify Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

function generateReceipt(booking, property, hostPayout, platformFee) {
    const nights = (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24);

    return {
        transactionId: booking.razorpayPaymentId,
        date: new Date().toISOString(),
        guestId: booking.user,
        stayCheckIn: new Date(booking.checkIn).toDateString(),
        stayCheckOut: new Date(booking.checkOut).toDateString(),
        nights: Math.ceil(nights),
        propertyTitle: property.title,
        propertyLocation: property.location?.city || property.location?.address,
        financials: {
            totalAmount: booking.totalPrice,
            platformFee: platformFee, // 25%
            hostPayout: hostPayout    // 75%
        },
        status: "CONFIRMED"
    };
}
