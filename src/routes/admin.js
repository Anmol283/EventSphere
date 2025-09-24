import { Router } from "express"
import { body, validationResult } from "express-validator"
import { requireAuth /*, requireAdmin*/ } from "../middleware/auth.js"
import Event from "../models/Event.js"
import Contact from "../models/Contact.js"

const router = Router()

router.use(requireAuth) // protect all admin routes

router.get("/", async (req, res, next) => {
  try {
    const [events, contacts] = await Promise.all([
      Event.find().sort({ date: 1 }).lean(),
      Contact.find().sort({ createdAt: -1 }).lean(),
    ])
    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      events,
      contacts,
    })
  } catch (e) {
    next(e)
  }
})

router.post(
  "/events",
  [
    body("title").trim().isLength({ min: 3 }).withMessage("Title is required."),
    body("date").isISO8601().withMessage("Valid date is required."),
    body("description").trim().isLength({ min: 10 }).withMessage("Description is required."),
    body("imageUrl").isURL().withMessage("Valid image URL is required."),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        errors.array().forEach((e) => req.flash("error", e.msg))
        return res.redirect("/admin")
      }
      const { title, date, description, imageUrl } = req.body
      await Event.create({ title, date, description, imageUrl })
      req.flash("success", "Event created.")
      res.redirect("/admin")
    } catch (e) {
      next(e)
    }
  },
)

router.delete("/events/:id", async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    req.flash("success", "Event removed.")
    res.redirect("/admin")
  } catch (e) {
    next(e)
  }
})

export default router
