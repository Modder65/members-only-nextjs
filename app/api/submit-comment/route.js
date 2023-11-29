import { NextResponse } from "next/server";
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
    console.log("Comment added:", newComment);

    return NextResponse.json({ message: "Comment added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}