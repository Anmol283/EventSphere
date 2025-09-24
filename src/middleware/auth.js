import jwt from "jsonwebtoken"
import User from "../models/User.js"

const JWT_COOKIE = "token"

// Create a signed JWT with a 1-day expiration
export function signJwt(payload) {
  const secret = process.env.JWT_SECRET || "devjwt"
  return jwt.sign(payload, secret, { expiresIn: "1d" })
}

// Validate and decode a JWT using the same secret
export function verifyJwt(token) {
  const secret = process.env.JWT_SECRET || "devjwt"
  return jwt.verify(token, secret)
}

// Middleware: if a valid token cookie exists, load the user into req.user and res.locals.user
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

// Middleware: ensure the request is from an authenticated user
export function requireAuth(req, res, next) {
  if (!req.user) {
    req.flash("error", "Please log in to access the dashboard.")
    return res.redirect("/login")
  }
  return next()
}

// Middleware: ensure the current user has the admin role
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    req.flash("error", "You do not have permission to access this page.")
    return res.redirect("/")
  }
  return next()
}

// Helper: send the JWT as a secure cookie to the client
export function setJwtCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24,
  })
}
