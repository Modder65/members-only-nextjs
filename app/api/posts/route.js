import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/connect-db.js";
import { PostModel } from "../../../models/post.js";

export async function GET() {
  console.log("Fetching posts");
  await connectDB();

  try {
    // Fetch posts from database
    const posts = await PostModel.find().populate("user", "name").exec();

    // Return the posts as a JSON response
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    // Handle errors
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}