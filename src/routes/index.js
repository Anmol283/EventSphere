import { Router } from "express"
import Event from "../models/Event.js"

const router = Router()

router.get("/", async (req, res, next) => {
  try {
    const featured = await Event.find().sort({ createdAt: -1 }).limit(3).lean()
    res.render("index", {
      title: "Event Sphere",
      tagline: "Discover. Connect. Celebrate.",
      featured,
    })
  } catch (e) {
    next(e)
  }
})

router.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    mission:
      "Event Sphere connects people through unforgettable experiences. Our mission is to make discovering and managing events effortless and delightful.",
  })
})

export default router
