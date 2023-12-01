import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  message: { type: String, required: true },
  comment: { type: Schema.Types.ObjectId, ref: "Comment", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const ReplyModel = mongoose.models.Reply || mongoose.model("Reply", ReplySchema);

