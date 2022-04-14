import mongoose from "mongoose"
const { Schema, model } = mongoose

const CartSchema = new Schema(
  {
    userId: { type: String, required: true, uniqe: true },
    products: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default model("Cart", CartSchema)
