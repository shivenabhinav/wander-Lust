

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["guest", "host", "admin"],
      default: "guest",
    },

    avatar: {
      type: String,
      default: null,
    },

    // Host-Specific Details (Nested Object)
    hostDetails: {
      phone: { type: String },
      bankName: { type: String },
      accountHolderName: { type: String },
      accountNumber: { type: String },
      ifsc: { type: String },
      razorpayContactId: { type: String },
      razorpayFundAccountId: { type: String },
      isVerifiedHost: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

mongoose.models.User && mongoose.deleteModel("User");


export default mongoose.models.User || mongoose.model("User", UserSchema);
