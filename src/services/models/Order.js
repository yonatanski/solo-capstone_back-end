import mongoose from "mongoose"
const { Schema, model } = mongoose

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true, uniqe: true },
    products: {
      type: Object,
      required: true,
    },

    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  {
    timestamps: true,
  }
)

export default model("Order", OrderSchema)
