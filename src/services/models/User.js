import mongoose from "mongoose"
const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    username: { type: String, required: true, uniqe: true },
    email: { type: String, required: true, uniqe: true },
    password: { type: String, required: true, uniqe: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

export default model("User", UserSchema)
