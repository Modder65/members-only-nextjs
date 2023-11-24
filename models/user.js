import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isMember: { type: String, required: false },
  isVerified: { type: String, default: true},
  verificationCode: { type: String },
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
