import mongoose from "mongoose"
const { Schema, model } = mongoose

const AnncouncSchema = new Schema(
  {
    message: { type: String },
  },
  {
    timestamps: true,
  }
)

export default model("Anncouncemnt", AnncouncSchema)
