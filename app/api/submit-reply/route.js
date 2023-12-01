import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connect-db.js";
import { ReplyModel } from "../../../models/reply.js";



export async function POST(request) {
  await connectDB();
  const { message, comment, user } = await request.json();

  try {
    const newReply = new ReplyModel({
      message,
      comment,
      user
    });

    await newReply.save();
    console.log("Reply added:", newReply);

    return NextResponse.json({ message: "Reply added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}