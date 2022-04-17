import mongoose from "mongoose"
const { Schema, model } = mongoose

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, uniqe: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array },
    size: { type: String },
    color: { type: String },
    price: { type: Number },
  },
  {
    timestamps: true,
  }
)

export default model("Product", ProductSchema)
