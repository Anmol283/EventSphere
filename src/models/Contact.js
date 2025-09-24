//contact.js
import mongoose from "mongoose"

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, maxlength: 3000 },
  },
  { timestamps: true },
)

export default mongoose.model("Contact", contactSchema)
