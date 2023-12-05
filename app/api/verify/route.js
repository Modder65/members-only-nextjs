import { NextResponse } from "next/server";
import { connectDB } from "../../libs/connect-db.js";
import { UserModel } from "../../../models/user.js";

export async function POST(request) {
  console.log("[API] Verification endpoint hit");
  await connectDB();
  const { code } = await request.json();
  console.log("Recieved code:", code);
  try {
    console.log("Verifying code:", code, "Type:", typeof code);
    const user = await UserModel.findOne({ verificationCode: code });
    console.log("User found:", user);
    if (user) {
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