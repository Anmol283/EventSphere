const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Setup
const mongoClient = new MongoClient(process.env.MONGODB_URI);
let db;

// Connect to MongoDB before starting the server
async function startServer() {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
    db = mongoClient.db(process.env.DB_NAME);

    console.log("Database:", db.databaseName);
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    app.listen(PORT, () => {
      console.log(`Event Sphere server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoClient.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

// Session configuration
app.use(
  session({
    secret: "event-sphere-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

// Flash message middleware
app.use((req, res, next) => {
  res.locals.success = req.session.success;
  res.locals.error = req.session.error;
  delete req.session.success;
  delete req.session.error;
  next();
});

// Make session globally available to EJS
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Auth middleware
const requireAuth = (req, res, next) => {
  if (req.session.isAdmin) next();
  else {
    req.session.error = "Please log in to access the admin panel.";
    res.redirect("/admin/login");
  }
};

// Routes
app.get("/", async (req, res) => {
  try {
    const featuredEvents = await db.collection("events")
      .find()
      .sort({ date: 1 })
      .limit(3)
      .toArray();

    res.render("index", {
      title: "Event Sphere - Your Gateway to Amazing Events",
      featuredEvents,
      userName: req.session.userName,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.render("index", {
      title: "Event Sphere - Your Gateway to Amazing Events",
      featuredEvents: [],
      userName: req.session.userName,
    });
  }
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Us - Event Sphere" });
});

app.get("/events", async (req, res) => {
  try {
    const events = await db.collection("events").find().sort({ date: 1 }).toArray();
    res.render("events", { title: "Events - Event Sphere", events });
  } catch (error) {
    console.error("Error fetching events:", error);
    req.session.error = "Failed to load events";
    res.redirect("/");
  }
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us - Event Sphere" });
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      req.session.error = "Please fill in all fields";
      return res.redirect("/contact");
    }
    const submission = { name, email, message, timestamp: new Date() };
    await db.collection("contacts").insertOne(submission);
    req.session.success = "Thank you for your message!";
    res.redirect("/contact");
  } catch (error) {
    console.error("Error saving contact:", error);
    req.session.error = "Failed to send message";
    res.redirect("/contact");
  }
});

// Admin routes
app.get("/admin/login", (req, res) => {
  if (req.session.isAdmin) return res.redirect("/admin");
  res.render("admin/login", { title: "Admin Login - Event Sphere" });
});

app.post("/admin/login", async (req, res) => {
  try {
    const { username, password, remember } = req.body;

    // Validate input
    if (!username || !password) {
      req.session.error = "Please provide both username and password.";
      return res.redirect("/admin/login");
    }

    // Check credentials against MongoDB admins collection
    const admin = await db.collection("admins").findOne({
      username: username,
      password: password
    });

    if (admin) {
      // Successful login
      req.session.isAdmin = true;
      req.session.adminId = admin._id.toString();
      req.session.adminUsername = admin.username;
      
      // Set session expiry based on "remember me"
      if (remember) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      } else {
        req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 1 day
      }
      
      req.session.success = "Welcome to the admin panel!";
      res.redirect("/admin");
    } else {
      // Invalid credentials
      req.session.error = "Invalid username or password.";
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.error("Login error:", error);
    req.session.error = "An error occurred during login. Please try again.";
    res.redirect("/admin/login");
  }
});

app.get("/admin/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

app.get("/admin", requireAuth, async (req, res) => {
  try {
    const events = await db.collection("events").find().sort({ date: -1 }).toArray();
    const contacts = await db.collection("contacts").find().sort({ timestamp: -1 }).toArray();
    const userCount = await db.collection("users").countDocuments();

    res.render("admin/dashboard", {
      title: "Admin Dashboard - Event Sphere",
      events,
      contactSubmissions: contacts,
      userCount,
      adminName: req.session.adminUsername || "Admin",
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.render("admin/dashboard", {
      title: "Admin Dashboard - Event Sphere",
      events: [],
      contactSubmissions: [],
      userCount: 0,
      adminName: req.session.adminUsername || "Admin",
      error: "Failed to load dashboard data",
    });
  }
});

app.post("/admin/events", requireAuth, async (req, res) => {
  try {
    const { title, description, date, image } = req.body;
    const newEvent = {
      title,
      description,
      date,
      image: image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop",
      createdAt: new Date(),
    };
    await db.collection("events").insertOne(newEvent);
    req.session.success = "Event added successfully!";
    res.redirect("/admin");
  } catch (error) {
    console.error("Error adding event:", error);
    req.session.error = "Failed to add event";
    res.redirect("/admin");
  }
});

app.put("/admin/events/:id", requireAuth, async (req, res) => {
  try {
    const eventId = new ObjectId(req.params.id);
    const { title, description, date, image } = req.body;
    
    const updatedEvent = {
      title,
      description,
      date,
      image: image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=250&fit=crop",
      updatedAt: new Date(),
    };
    
    await db.collection("events").updateOne(
      { _id: eventId },
      { $set: updatedEvent }
    );
    
    req.session.success = "Event updated successfully!";
    res.redirect("/admin");
  } catch (error) {
    console.error("Error updating event:", error);
    req.session.error = "Failed to update event";
    res.redirect("/admin");
  }
});

app.delete("/admin/events/:id", requireAuth, async (req, res) => {
  try {
    const eventId = new ObjectId(req.params.id);
    await db.collection("events").deleteOne({ _id: eventId });
    req.session.success = "Event deleted successfully!";
    res.redirect("/admin");
  } catch (error) {
    console.error("Error deleting event:", error);
    req.session.error = "Failed to delete event";
    res.redirect("/admin");
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found - Event Sphere" });
});

// Start server
startServer().catch(console.error);