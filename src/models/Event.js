//event.js
import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    date: { type: Date, required: true },
    description: { type: String, required: true, maxlength: 2000 },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true },
)

eventSchema.index({ title: "text", description: "text" })

export default mongoose.model("Event", eventSchema)
