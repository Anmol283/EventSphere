import jwt from "jsonwebtoken"
import User from "../models/User.js" //path

const JWT_COOKIE = "token"

export function signJwt(payload) {
  const secret = process.env.JWT_SECRET || "devjwt"
  return jwt.sign(payload, secret, { expiresIn: "1d" })
}

export function verifyJwt(token) {
  const secret = process.env.JWT_SECRET || "devjwt"
  return jwt.verify(token, secret)
}

// Adds res.locals.user if valid token exists
export async function attachCurrentUser(req, res, next) {
  res.locals.user = null
  try {
    const token = req.cookies[JWT_COOKIE]
    if (!token) return next()
    const decoded = verifyJwt(token)
    const user = await User.findById(decoded.id).select("-password").lean()
    if (user) {
      res.locals.user = user
      req.user = user
    }
    return next()
  } catch (err) {
    res.clearCookie(JWT_COOKIE)
    return next()
  }
}

// Protects admin routes
export function requireAuth(req, res, next) {
  if (!req.user) {
    req.flash("error", "Please log in to access the dashboard.")
    return res.redirect("/login")
  }
  return next()
}

// Optional: require admin role
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    req.flash("error", "You do not have permission to access this page.")
    return res.redirect("/")
  }
  return next()
}

// Set JWT cookie
export function setJwtCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24,
  })
}
