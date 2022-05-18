import mongoose from "mongoose"
const { Schema, model } = mongoose

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, uniqe: true },
    desc: { type: String, required: true },
    img: { type: Array },
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

export default model("Product", ProductSchema)
