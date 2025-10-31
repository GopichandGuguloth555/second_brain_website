import { model, Schema, Types } from "mongoose";
import mongoose  from "mongoose";
import { z } from "zod";

mongoose.connect("mongodb://127.0.0.1:27017/SecondBrain");


const userSchema = new Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
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
})
export const linkModel = model("links", linkSchema);

