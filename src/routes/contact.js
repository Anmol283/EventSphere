//contact.js
import { Router } from "express"
import { body, validationResult } from "express-validator"
import Contact from "../models/Contact.js"

const router = Router()

router.get("/", (req, res) => {
  res.render("contact", { title: "Contact" })
})

router.post(
  "/",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required.").normalizeEmail(),
    body("message").trim().isLength({ min: 10 }).withMessage("Please write a message of at least 10 characters."),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        errors.array().forEach((e) => req.flash("error", e.msg))
        return res.redirect("/contact")
      }
      const { name, email, message } = req.body
      await Contact.create({ name, email, message })
      req.flash("success", "Thanks! Your message has been received.")
      res.redirect("/contact")
    } catch (e) {
      next(e)
    }
  },
)

export default router
