// Import required modules
import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Name of the cookie where JWT will be stored
const JWT_COOKIE = "token"

// Function to create (sign) a JWT with a 1-day expiration
export function signJwt(payload) {
  const secret = process.env.JWT_SECRET || "devjwt" // Use env secret or fallback
  return jwt.sign(payload, secret, { expiresIn: "1d" }) // Create token
}

// Function to verify a JWT and return decoded payload
export function verifyJwt(token) {
  const secret = process.env.JWT_SECRET || "devjwt"
  return jwt.verify(token, secret) // Throws error if invalid/expired
}

// Middleware: Attach currently logged-in user to req/res if token is valid
export async function attachCurrentUser(req, res, next) {
  res.locals.user = null // Default = no user
  try {
    const token = req.cookies[JWT_COOKIE] // Read JWT from cookie
    if (!token) return next() // If no token, move on
    const decoded = verifyJwt(token) // Decode token
    const user = await User.findById(decoded.id).select("-password").lean() 
    // Find user by ID from token, exclude password, return plain object

    if (user) {
      res.locals.user = user // Makes user available in views
      req.user = user        // Makes user available in routes
    }
    return next()
  } catch (err) {
    res.clearCookie(JWT_COOKIE) // If token invalid/expired, clear cookie
    return next()
  }
}

// Middleware: Restrict access to authenticated users only
export function requireAuth(req, res, next) {
  if (!req.user) {
    req.flash("error", "Please log in to access the dashboard.") // Flash error
    return res.redirect("/login") // Redirect to login page
  }
  return next()
}

// Middleware: Restrict access to admin users only
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    req.flash("error", "You do not have permission to access this page.")
    return res.redirect("/") // Redirect non-admins to homepage
  }
  return next()
}

// Helper: Set JWT as an HTTP-only cookie in response
export function setJwtCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true, // JS on frontend cannot access cookie
    sameSite: "lax", // Protect against CSRF
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    maxAge: 1000 * 60 * 60 * 24, // Expire after 1 day
  })
}
