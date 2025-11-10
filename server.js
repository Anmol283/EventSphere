const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// 🔴 REDIS CLOUD CONFIGURATION
// ========================================
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "redis-17731.c232.us-east-1-2.ec2.redns.redis-cloud.com",
    port: process.env.REDIS_PORT || 17731,
  },
  password: process.env.REDIS_PASSWORD || "Mz07h2ZI2aUpHEevzvHB77FGppADY1UA",
});

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));
redisClient.on("connect", () => console.log("✅ Connected to Redis Cloud"));
redisClient.on("ready", () => console.log("✅ Redis is ready for use"));

// ========================================
// 🟢 MONGODB CONFIGURATION
// ========================================
const mongoClient = new MongoClient(process.env.MONGODB_URI);
let db;

// ========================================
// ⚙️ BASIC MIDDLEWARE (before session)
// ========================================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

// ========================================
// 🚀 SERVER STARTUP
// ========================================
async function startServer() {
  try {
    // 1️⃣ Connect to Redis FIRST
    await redisClient.connect();
    console.log("✅ Redis Cloud connected successfully");

    // 2️⃣ Setup session middleware AFTER Redis connects
    app.use(
      session({
        store: new RedisStore({ 
          client: redisClient,
          prefix: "sess:",
        }),
        secret: process.env.SESSION_SECRET || "event-sphere-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        },
      })
    );
    
    console.log("✅ Session middleware configured with Redis");

    // 3️⃣ Flash message middleware
    app.use((req, res, next) => {
      res.locals.success = req.session.success;
      res.locals.error = req.session.error;
      delete req.session.success;
      delete req.session.error;
      next();
    });

    app.use((req, res, next) => {
      res.locals.session = req.session;
      next();
    });

    // 4️⃣ Static files AFTER session (so routes take priority)
    app.use(express.static(path.join(__dirname, "public")));

    // 5️⃣ Connect to MongoDB
    await mongoClient.connect();
    console.log("✅ Connected to MongoDB");
    db = mongoClient.db(process.env.DB_NAME);
    console.log("🗂️ Using Database:", db.databaseName);

    // 6️⃣ Register routes AFTER all middleware
    console.log("📝 Registering routes...");
    
    // ========================================
    // 🌐 PUBLIC ROUTES
    // ========================================
    
    // TEST ROUTE
    app.get("/test-session", (req, res) => {
      console.log("🔍 Test session route hit! (Session is saved in Redis)");
      if (!req.session.views) {
        req.session.views = 0;
      }
      req.session.views++;
      res.json({ 
        message: "✅ Session test successful! Redis is working!", 
        views: req.session.views,
        sessionID: req.sessionID 
      });
    });

    // HOME ROUTE (CACHED)
    app.get("/", async (req, res) => {
      const cacheKey = "events:featured"; // Define a cache key
      try {
        let featuredEvents = await getCachedData(cacheKey); // 1. Try Redis

        if (!featuredEvents) {
          console.log("⚡ Cache MISS (Featured): Fetching from MongoDB.");
          // 2. If no cache, fetch from MongoDB
          featuredEvents = await db.collection("events")
            .find()
            .sort({ date: 1 })
            .limit(3)
            .toArray();

          await setCachedData(cacheKey, featuredEvents); // 3. Store in Redis
        } else {
          console.log("✅ Cache HIT (Featured): Serving from Redis.");
        }

        res.render("index", {
          title: "Event Sphere - Your Gateway to Amazing Events",
          featuredEvents,
          userName: req.session.userName,
        });
      } catch (error) {
        console.error("Error fetching featured events:", error);
        res.render("index", {
          title: "Event Sphere - Your Gateway to Amazing Events",
          featuredEvents: [],
          userName: req.session.userName,
        });
      }
    });

    // ABOUT PAGE
    app.get("/about", (req, res) => {
      res.render("about", { title: "About Us - Event Sphere" });
    });

    // EVENTS PAGE (CACHED)
    app.get("/events", async (req, res) => {
      const cacheKey = "events:all"; // Define a cache key

      try {
        let events = await getCachedData(cacheKey); // 1. Try Redis

        if (!events) {
          console.log("⚡ Cache MISS (All): Fetching from MongoDB.");
          // 2. If no cache, fetch from MongoDB
          events = await db.collection("events").find().sort({ date: 1 }).toArray();
          await setCachedData(cacheKey, events); // 3. Store in Redis
        } else {
          console.log("✅ Cache HIT (All): Serving from Redis.");
        }

        res.render("events", { title: "Events - Event Sphere", events });
      } catch (error) {
        console.error("Error fetching events:", error);
        req.session.error = "Failed to load events";
        res.redirect("/");
      }
    });
// EVENT DETAILS PAGE
app.get("/events/:id", async (req, res) => {
    try {
        const eventId = req.params.id;

        // Validate if eventId is a valid MongoDB ObjectId
        if (!ObjectId.isValid(eventId)) {
            req.session.error = "Invalid event ID provided.";
            return res.status(404).redirect("/events");
        }

        const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) });

        if (!event) {
            req.session.error = "Event not found.";
            return res.status(404).redirect("/events");
        }

        res.render("eventdetails", {
            title: event.title + " - Event Sphere",
            event: event,
        });
    } catch (error) {
        console.error("Error fetching event details:", error);
        req.session.error = "Failed to load event details.";
        res.status(500).redirect("/events");
    }
});



    // CONTACT PAGE
    app.get("/contact", (req, res) => {
      res.render("contact", { title: "Contact Us - Event Sphere" });
    });

    // CONTACT FORM SUBMISSION
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

    // ========================================
    // 🔐 ADMIN ROUTES
    // ========================================

    // ADMIN LOGIN PAGE
    app.get("/admin/login", (req, res) => {
      if (req.session.isAdmin) return res.redirect("/admin");
      res.render("admin/login", { title: "Admin Login - Event Sphere" });
    });

    // ADMIN LOGIN POST
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

    // ADMIN LOGOUT
    app.get("/admin/logout", (req, res) => {
      req.session.destroy(() => res.redirect("/"));
    });

    app.post("/admin/logout", (req, res) => {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
        }
        res.redirect("/admin/login");
      });
    });

    // ADMIN DASHBOARD
    app.get("/admin", requireAuth, async (req, res) => {
      try {
        // Dashboard data is still fetched directly to ensure real-time admin view
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

    // ADD EVENT (WITH CACHE INVALIDATION)
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
        
        // 🗑️ Invalidate cache after data modification
        await invalidateCache("events:*"); 
        
        req.session.success = "Event added successfully!";
        res.redirect("/admin");
      } catch (error) {
        console.error("Error adding event:", error);
        req.session.error = "Failed to add event";
        res.redirect("/admin");
      }
    });

    // UPDATE EVENT (WITH CACHE INVALIDATION)
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
        
        // 🗑️ Invalidate cache after data modification
        await invalidateCache("events:*");
        
        req.session.success = "Event updated successfully!";
        res.redirect("/admin");
      } catch (error) {
        console.error("Error updating event:", error);
        req.session.error = "Failed to update event";
        res.redirect("/admin");
      }
    });

    // DELETE EVENT (WITH CACHE INVALIDATION)
    app.delete("/admin/events/:id", requireAuth, async (req, res) => {
      try {
        const eventId = new ObjectId(req.params.id);
        await db.collection("events").deleteOne({ _id: eventId });
        
        // 🗑️ Invalidate cache after data modification
        await invalidateCache("events:*");
        
        req.session.success = "Event deleted successfully!";
        res.redirect("/admin");
      } catch (error) {
        console.error("Error deleting event:", error);
        req.session.error = "Failed to delete event";
        res.redirect("/admin");
      }
    });

    // ========================================
    // 404 HANDLER
    // ========================================
    
    app.use((req, res) => {
      res.status(404).render("404", { title: "Page Not Found - Event Sphere" });
    });

    console.log("✅ All routes registered successfully");

    // 7️⃣ Start server
    app.listen(PORT, () => {
      console.log(`\n🌐 Event Sphere server running at http://localhost:${PORT}`);
      console.log(`📍 Test session at: http://localhost:${PORT}/test-session\n`);
    });
  } catch (error) {
    console.error("🚨 Startup error:", error);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// ========================================
// 🛡️ AUTH MIDDLEWARE
// ========================================
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    req.session.error = "Please log in to access the admin panel.";
    res.redirect("/admin/login");
  }
};

// ========================================
// 🧠 REDIS CACHE HELPERS
// ========================================
const CACHE_TTL = 300;

async function getCachedData(key) {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

async function setCachedData(key, data, ttl = CACHE_TTL) {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    console.log(`✅ Cached data for key: ${key}`);
  } catch (error) {
    console.error("Redis set error:", error);
  }
}

async function invalidateCache(pattern) {
  try {
    // Note: 'KEYS' command is blocked in some environments (like Redis Cloud on high-load plans). 
    // For local dev/small projects, it's fine. For production, consider tracking keys in a separate set.
    const keys = await redisClient.keys(pattern); 
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`🗑️ Invalidated ${keys.length} cache keys matching pattern: ${pattern}`);
    } else {
        console.log(`🔍 No cache keys found for pattern: ${pattern}`);
    }
  } catch (error) {
    console.error("Redis invalidate error:", error);
  }
}

// ========================================
// 🧹 GRACEFUL SHUTDOWN
// ========================================
process.on("SIGINT", async () => {
  try {
    await redisClient.quit();
    await mongoClient.close();
    console.log("🧹 Redis and MongoDB connections closed gracefully");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

// ========================================
// 🚀 START SERVER
// ========================================
startServer().catch(console.error);

// Export for use in routes
module.exports = { db, getCachedData, setCachedData, invalidateCache, requireAuth };