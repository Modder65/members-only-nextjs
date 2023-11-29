import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connect-db.js";
import { PostModel } from "../../../models/post.js";
import { CommentModel } from "../../../models/comment.js";

export const dynamic = "force-dynamic"; // makes sure the route is dynamic and fetch request always has the latest updated data
                                        // needed when deploying to vercel as it makes the routes static

export async function GET() {
  await connectDB();

  try {
    const posts = await PostModel.find()
      .populate("user", "name")
      .lean(); // Use .lean() for faster reads

    // Fetch comments for each post
    for (let post of posts) {
      const comments = await CommentModel.find({ post: post._id })
        .populate("user", "name")
        .lean();
      post.comments = comments; // Attach comments to each post
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}