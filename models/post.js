import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const PostModel = mongoose.models.Post || mongoose.model("Post", PostSchema);
