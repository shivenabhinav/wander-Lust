
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    guests: {
      type: Number,
      default: 1,
      min: 1,
    },

    // ⭐ REVENUE SPLIT & HOST INFO
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    totalPrice: { type: Number, required: true },
    nightlyPrice: { type: Number },
    platformFee: { type: Number, default: 0 },
    hostPayout: { type: Number, default: 0 },

    // ⭐ PAYMENT STATUS + RAZORPAY REFERENCES
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    razorpayOrderId: { type: String }, // order created for guest
    razorpayPaymentId: { type: String }, // actual payment success
    razorpayRefundId: { type: String }, // if refunded

    // ⭐ BOOKING STATUS
    status: {
      type: String,
      enum: [
        "pending",        // user started booking but didn’t pay
        "confirmed",      // paid successfully
        "cancelled",      // user cancelled
        "completed"       // stay finished
      ],
      default: "pending",
    },

    // ⭐ FOR HOST PAYOUTS
    payoutStatus: {
      type: String,
      enum: ["pending", "processing", "paid", "failed"],
      default: "pending",
    },

    payoutId: { type: String }, // Razorpay Payout ID
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
