import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connect-db.js";
import { UserModel } from "../../../models/user.js";

export async function POST(request) {
  await connectDB();
  const { code } = await request.json();

  try {
    const user = await UserModel.findOne({ verificationCode: code });
    if (user && !user.isVerified) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json({ email: user.email, message: "Account verified "}, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}