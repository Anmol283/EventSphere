//auth.js
import { Router } from "express"
import { body, validationResult } from "express-validator"
import bcrypt from "bcryptjs"
import User from "../models/User.js"
import { signJwt, setJwtCookie } from "../middleware/auth.js"

const router = Router()

router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" })
})

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required.").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password is required."),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        errors.array().forEach((e) => req.flash("error", e.msg))
        return res.redirect("/login")
      }
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        req.flash("error", "Invalid credentials.")
        return res.redirect("/login")
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        req.flash("error", "Invalid credentials.")
        return res.redirect("/login")
      }
      const token = signJwt({ id: user._id, role: user.role })
      setJwtCookie(res, token)
      req.flash("success", "Welcome back!")
      res.redirect("/admin")
    } catch (e) {
      next(e)
    }
  },
)

router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register" })
})

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name is required."),
    body("email").isEmail().withMessage("Valid email is required.").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        errors.array().forEach((e) => req.flash("error", e.msg))
        return res.redirect("/register")
      }
      const { name, email, password } = req.body
      const exists = await User.findOne({ email })
      if (exists) {
        req.flash("error", "Email already registered.")
        return res.redirect("/register")
      }
      const hash = await bcrypt.hash(password, 10)
      const isFirstUser = (await User.countDocuments()) === 0
      const user = await User.create({
        name,
        email,
        password: hash,
        role: isFirstUser ? "admin" : "user",
      })
      const token = signJwt({ id: user._id, role: user.role })
      setJwtCookie(res, token)
      req.flash("success", "Account created. Welcome!")
      res.redirect("/admin")
    } catch (e) {
      next(e)
    }
  },
)

router.post("/logout", (req, res) => {
  res.clearCookie("token")
  req.flash("success", "You have been logged out.")
  res.redirect("/")
})

export default router
