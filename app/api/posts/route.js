import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connect-db.js";
import { PostModel } from "../../../models/post.js";
import { CommentModel } from "../../../models/comment.js";
import { ReplyModel } from "../../../models/reply.js";

export const dynamic = "force-dynamic"; // makes sure the route is dynamic and fetch request always has the latest updated data
                                        // needed when deploying to vercel as it makes the routes static by default

export async function GET() {
  await connectDB();

  try {
    // Fetch posts and populate comments and replies in a nested manner
    const posts = await PostModel.find()
      .populate("user", "name")
      .lean(); // Use .lean() for faster reads

      for (let post of posts) {
        const comments = await CommentModel.find({ post: post._id })
          .populate("user", "name")
          .lean();
        
        for (let comment of comments) {
          const replies = await ReplyModel.find({ comment: comment._id })
            .populate("user", "name")
            .lean();
          comment.replies = replies; // Attach replies to each comment
        }
  
        post.comments = comments; // Attach comments to each post
      }
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}