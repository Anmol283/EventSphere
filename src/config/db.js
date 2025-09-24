import mongoose from "mongoose"

export default async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/eventsphere"
  try {
    await mongoose.connect(uri, { autoIndex: true })
    console.log("MongoDB connected")
  } catch (err) {
    console.error("MongoDB connection error:", err.message)
    process.exit(1)
  }
}
