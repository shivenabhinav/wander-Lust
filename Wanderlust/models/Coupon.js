import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: String,
  description: String,

  discountType: {
    type: String,
    enum: ["PERCENT", "FLAT"],
    required: true,
  },

  value: { type: Number, required: true },

  minAmount: { type: Number, default: 0 },
  minNights: { type: Number, default: 0 },

  categories: { type: [String], default: [] },

  firstBookingOnly: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
});

export default mongoose.models.Coupon ||
  mongoose.model("Coupon", CouponSchema);