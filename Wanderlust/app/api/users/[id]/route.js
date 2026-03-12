
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
