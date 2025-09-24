import { Router } from "express"
import { query, validationResult } from "express-validator"
import Event from "../models/Event.js"

const router = Router()

router.get(
  "/",
  [query("q").optional().isString().trim().escape(), query("from").optional().isISO8601().toDate()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        req.flash("error", "Invalid search parameters.")
      }
      const { q, from } = req.query
      const filter = {}
      if (q) {
        filter.$text = { $search: q }
      }
      if (from) {
        filter.date = { $gte: from }
      }
      const events = await Event.find(filter).sort({ date: 1 }).lean()
      res.render("events", {
        title: "Events",
        events,
        q: q || "",
        from: from ? new Date(from).toISOString().slice(0, 10) : "",
      })
    } catch (e) {
      next(e)
    }
  },
)

export default router
