import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher.js";
import { connectDB } from "../../../lib/connect-db.js";
import { CommentModel } from "../../../models/comment.js";



export async function POST(request) {
  await connectDB();
  const { message, post, user } = await request.json();

  try {
    const newComment = new CommentModel({
      message,
      post,
      user
    });

    await newComment.save();
    await newComment.populate({
      path: "user",
      select: "name"
    });

    console.log("Comment added:", newComment);

    await pusherServer.trigger("posts-channel", "new-comment", {
      _id: newComment._id, // Include the _id of the new comment
      message: newComment.message,
      post: newComment.post,
      user: { name: newComment.user.name }, // Assuming you only need the name
      createdAt: newComment.createdAt
    });
    console.log("Pusher trigger for comment successful");

    return NextResponse.json({ message: "Comment created successfully" }, { status: 200});
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


