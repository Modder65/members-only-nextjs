import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  message: { type: String, required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const CommentModel = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);