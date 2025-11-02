const express = require("express")
const session = require("express-session")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

// Sample events data (in-memory storage)
let events = [
  {
    id: 1,
    title: "Tech Conference 2024",
    description:
      "Join us for the biggest tech conference of the year featuring industry leaders and innovative technologies.",
    date: "2024-03-15",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    title: "Music Festival",
    description: "Experience amazing live performances from top artists in a beautiful outdoor setting.",
    date: "2024-04-20",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    title: "Food & Wine Expo",
    description: "Discover culinary delights and premium wines from renowned chefs and vintners.",
    date: "2024-05-10",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
  },
]

// Contact form submissions (in-memory storage)
const contactSubmissions = []

// Admin credentials (hardcoded for demo)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "password123",
}

// Middleware
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride("_method"))

// Session configuration
app.use(
  session({
    secret: "event-sphere-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  }),
)

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.success = req.session.success
  res.locals.error = req.session.error
  delete req.session.success
  delete req.session.error
  next()
})

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.isAdmin) {
    next()
  } else {
    req.session.error = "Please log in to access the admin panel."
    res.redirect("/admin/login")
  }
}

// Routes
app.get("/", (req, res) => {
  const featuredEvents = events.slice(0, 3)
  res.render("index", {
    title: "Event Sphere - Your Gateway to Amazing Events",
    featuredEvents,
  })
})

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Us - Event Sphere",
  })
})

app.get("/events", (req, res) => {
  res.render("events", {
    title: "Upcoming Events - Event Sphere",
    events,
  })
})

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Us - Event Sphere",
  })
})

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body

  // Basic validation
  if (!name || !email || !message) {
    req.session.error = "Please fill in all fields."
    return res.redirect("/contact")
  }

  // Store submission
  const submission = {
    id: Date.now(),
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
  }

  contactSubmissions.push(submission)
  console.log("New contact submission:", submission)

  req.session.success = "Thank you for your message! We will get back to you soon."
  res.redirect("/contact")
})

// Admin routes
app.get("/admin/login", (req, res) => {
  if (req.session.isAdmin) {
    return res.redirect("/admin")
  }
  res.render("admin/login", {
    title: "Admin Login - Event Sphere",
  })
})

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    req.session.isAdmin = true
    req.session.success = "Welcome to the admin panel!"
    res.redirect("/admin")
  } else {
    req.session.error = "Invalid username or password."
    res.redirect("/admin/login")
  }
})

app.get("/admin/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})

app.get("/admin", requireAuth, (req, res) => {
  res.render("admin/dashboard", {
    title: "Admin Dashboard - Event Sphere",
    events,
    contactSubmissions,
  })
})

app.post("/admin/events", requireAuth, (req, res) => {
  const { title, description, date, image } = req.body

  if (!title || !description || !date) {
    req.session.error = "Please fill in all required fields."
    return res.redirect("/admin")
  }

  const newEvent = {
    id: Date.now(),
    title,
    description,
    date,
    image: image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop",
  }

  events.push(newEvent)
  req.session.success = "Event added successfully!"
  res.redirect("/admin")
})

app.delete("/admin/events/:id", requireAuth, (req, res) => {
  const eventId = Number.parseInt(req.params.id)
  events = events.filter((event) => event.id !== eventId)
  req.session.success = "Event deleted successfully!"
  res.redirect("/admin")
})

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found - Event Sphere",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Event Sphere server is running on http://localhost:${PORT}`)
})
