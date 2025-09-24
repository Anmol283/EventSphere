import path from "path"
import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import helmet from "helmet"
import compression from "compression"
import cookieParser from "cookie-parser"
import session from "express-session"
import flash from "connect-flash"
import methodOverride from "method-override"
import { fileURLToPath } from "url"
import connectDB from "./src/config/db.js"
import { attachCurrentUser } from "./src/middleware/auth.js"
import errorHandler from "./src/middleware/errorHandler.js"
import indexRoutes from "./src/routes/index.js"
import authRoutes from "./src/routes/auth.js"
import eventsRoutes from "./src/routes/events.js"
import contactRoutes from "./src/routes/contact.js"
import adminRoutes from "./src/routes/admin.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// DB
await connectDB()

// View engine
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "src", "views"))

// Static
app.use(express.static(path.join(__dirname, "public")))

// Security & perf
app.use(helmet())
app.use(compression())

// Parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// Method override for forms (DELETE)
app.use(methodOverride("_method"))

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"))
}

// Sessions for flash messages (auth uses JWT)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsession",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  }),
)
app.use(flash())

// Set flash and user to locals for all templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next()
})

// Attach current user (from JWT cookie) for templates
app.use(attachCurrentUser)

// Routes
app.use("/", indexRoutes)
app.use("/", authRoutes)
app.use("/events", eventsRoutes)
app.use("/contact", contactRoutes)
app.use("/admin", adminRoutes)

// 404
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found",
    message: "The page you are looking for does not exist.",
  })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Event Sphere running on http://localhost:${PORT}`)
})
