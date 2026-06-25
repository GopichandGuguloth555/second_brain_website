import { model, Schema } from "mongoose";
import mongoose from "mongoose";
import { MONGODB_URI } from './config';

export async function connectDb(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
}

const userSchema = new Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String },
  email: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local', 'google', 'demo'], default: 'local' },
});
export const userModel = model("User", userSchema);

const contentSchema = new Schema({
    title: {type: String},
    link:{type: String, required:true},
    tags:[{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId:{type:mongoose.Types.ObjectId, ref:'User', required: true }
});
export const contentModel = model("content", contentSchema);

const linkSchema = new Schema({
   hash: String,
   userId:{type:mongoose.Types.ObjectId, ref:'User', required: true }
}, { timestamps: true });
export const linkModel = model("links", linkSchema);
