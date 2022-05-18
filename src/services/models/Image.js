import mongoose from "mongoose"
const { Schema, model } = mongoose

const ImageSchema = new Schema(
  {
    img: { type: Array },
  },
  {
    timestamps: true,
  }
)

export default model("Image", ImageSchema)
