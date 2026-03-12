import Razorpay from "razorpay";

const instance =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
    : null;

if (!instance) {
  console.warn("⚠️ Razorpay keys missing. Payment features will be disabled.");
}

export const razorpay = instance;
