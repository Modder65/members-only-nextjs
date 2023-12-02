import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { connectDB } from "@/lib/connect-db.js";
import { PostModel } from "@/models/post";

export async function POST(request) {
  console.log("Post request received");
  await connectDB();
  const { title, message, userId } = await request.json();
  console.log("Received Data:", { title, message, userId });

  try {
    const post = new PostModel({ title, message, user: userId });
    console.log("Post to be saved:", post);
    await post.save();
    console.log("Post saved successfully");

    // Trigger Pusher event
    await pusherServer.trigger("posts-channel", "new-post", {
      // Include necesary post data
      _id: post._id,
      title: post.title,
      message: post.message,
      user: userId,
      createdAt: post.createdAt
    });

    return NextResponse.json({ message: "Post created successfully" }, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error saving post", error);
    return NextResponse.json({ error: "Internal server error" }, {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}