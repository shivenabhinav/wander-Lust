import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { razorpay } from "@/lib/razorpay";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      name,
      email,
      password,
      avatar,
      role,
      phone,
      bankName,
      accountHolderName,
      accountNumber,
      ifsc,
    } = body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let razorpayContactId = null;
    let razorpayFundAccountId = null;
    let hostDetails = {};

    // -----------------------------------------------------
    // ⭐ IF USER IS HOST → Create Razorpay Contact + Fund Account
    // -----------------------------------------------------
    if (role === "host") {
      if (!phone || !bankName || !accountHolderName || !accountNumber || !ifsc) {
        return NextResponse.json(
          { error: "All bank details are required for hosts." },
          { status: 400 }
        );
      }

      console.log("Razorpay Instance:", razorpay ? "Active" : "Null");

      if (!razorpay) {
        return NextResponse.json(
          { error: "Payment gateway configuration missing on server." },
          { status: 503 }
        );
      }

      // 1️⃣ Create Razorpay Contact
      try {
        // DIRECT API CALL WORKAROUND due to missing contacts helper
        const contact = await razorpay.api.post({
          url: '/contacts',
          data: {
            name,
            email,
            contact: phone,
            type: "vendor",
          }
        });
        razorpayContactId = contact.id;
      } catch (err) {
        console.error("Razorpay Contact Error:", err);
        console.error("Razorpay Contact Error:", err);
        return NextResponse.json({
          error: "Failed to create Razorpay Contact",
          details: err.error ? err.error.description : err.message
        }, { status: 500 });
      }

      // 2️⃣ Create Fund Account
      try {
        const fundAccount = await razorpay.api.post({
          url: '/fund_accounts',
          data: {
            contact_id: razorpayContactId,
            account_type: "bank_account",
            bank_account: {
              name: accountHolderName,
              ifsc: ifsc,
              account_number: accountNumber,
            },
          }
        });
        razorpayFundAccountId = fundAccount.id;
      } catch (err) {
        console.error("Razorpay Fund Account Error:", err);
        return NextResponse.json({
          error: "Failed to create Razorpay Fund Account",
          details: err.error ? err.error.description : err.message
        }, { status: 500 });
      }

      hostDetails = {
        phone,
        bankName,
        accountHolderName,
        accountNumber,
        ifsc,
        razorpayContactId,
        razorpayFundAccountId,
        isVerifiedHost: true
      };
    }

    // -----------------------------------------------------
    //  Save User in MongoDB
    // -----------------------------------------------------
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar, // Schema has 'avatar', request had 'avatar' or 'profileImage', consistently using avatar
      role,
      hostDetails: role === "host" ? hostDetails : undefined,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("🔥 Registration Error:", error);

    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
