import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher.js";
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

    // Trigger a Pusher event
    await pusherServer.trigger("posts-channel", "new-reply", {
      // Include necessary reply data
      _id: newReply._id,
      message: newReply.message,
      comment: newReply.comment,
      user: newReply.user,
      createdAt: newReply.createdAt
    })

    return NextResponse.json({ message: "Reply added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}