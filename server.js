const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const http = require("http");
// 🆕 ADDED: HTTPS module for secure serving
const https = require("https"); 
const fs = require("fs"); // 🆕 ADDED: File system access to read PEM files
const { Server: SocketIO } = require("socket.io");
require("dotenv").config();
const { signToken, verifyToken } = require("./middleware/jwtAuth");

const app = express();
// ❌ REMOVED: const httpServer = http.createServer(app); 
// We will create the server below as HTTPS or HTTP depending on environment.
const PORT = process.env.PORT || 3000;

// Global references
let db;
let io; // Global Socket.IO instance

// ========================================
// 🆕 HTTPS CERTIFICATE CONFIGURATION
// ========================================
let serverOptions = null;
const keyPath = path.join(__dirname, 'localhostkey.pem');
const certPath = path.join(__dirname, 'localhostcert.pem');

// Only use HTTPS files if they exist (for local development)
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    serverOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    };
    console.log("✅ Localhost PEM certificates loaded for HTTPS.");
} else {
    console.warn("⚠️ PEM files not found. Server will run on HTTP only. (Files needed: localhostkey.pem, localhostcert.pem)");
}

// 🆕 Create the appropriate server instance
const serverProtocol = serverOptions ? https : http;
const httpServer = serverProtocol.createServer(serverOptions || app, serverOptions ? app : null);
// Note: if serverOptions is present, the app handler is the second argument for https.createServer
// If not, we fall back to http.createServer(app)

// ========================================
// 🔴 REDIS CONFIGURATION (Local or Cloud)
// ========================================
const redisConfig = {
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
};

if (process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD.trim()) {
  redisConfig.password = process.env.REDIS_PASSWORD;
}

const redisClient = createClient(redisConfig);

redisClient.on("error", (err) => console.error("❌ Redis Client Error:", err));
redisClient.on("connect", () => console.log("✅ Connected to Redis"));
redisClient.on("ready", () => console.log("✅ Redis is ready for use"));

// ========================================
// 🟢 MONGODB CONFIGURATION
// ========================================
const mongoClient = new MongoClient(process.env.MONGODB_URI);

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
          // 🆕 IMPORTANT: Set secure to true when running HTTPS locally, or conditionally based on environment
          secure: !!serverOptions || process.env.NODE_ENV === 'production', 
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

    // 4️⃣ Static files AFTER session 
    app.use(express.static(path.join(__dirname, "public")));

    // 5️⃣ Connect to MongoDB
    await mongoClient.connect();
    console.log("✅ Connected to MongoDB");
    db = mongoClient.db(process.env.DB_NAME);
    console.log("🗂️ Using Database:", db.databaseName);

    // 6️⃣ Initialize Socket.IO Server 🆕
    // Use the appropriate protocol (https or http) in the origin
    const baseProtocol = serverOptions ? 'https' : 'http';
    
    io = new SocketIO(httpServer, {
      cors: {
        // Allows the client to connect from the same origin
        origin: process.env.BASE_URL || `${baseProtocol}://localhost:${PORT}`,
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    io.on("connection", (socket) => {
      console.log(`🔗 Socket.IO client connected: ${socket.id}`);
      // Add more socket listeners here later (e.g., chat, status updates)
      socket.on("disconnect", (reason) => {
        console.log(`🪢 Socket.IO client disconnected: ${socket.id}. Reason: ${reason}`);
      });
    });
    console.log("✅ Socket.IO server initialized and attached to HTTP/HTTPS server.");


    // 7️⃣ Register routes AFTER all middleware
    console.log("📝 Registering routes...");

    // ========================================
    // 🌐 PUBLIC ROUTES
    // ========================================

    // TEST ROUTE - VISUAL REDIS VERIFICATION
    app.get("/test-session", (req, res) => {
      console.log("🔍 Test session route hit! (Session is saved in Redis)");
      if (!req.session.views) {
        req.session.views = 0;
      }
      req.session.views++;
      console.log(`✅ Session views: ${req.session.views} | Session ID: ${req.sessionID}`);

      res.render("redis-test", {
        title: "Redis Verification - Event Sphere",
        views: req.session.views,
        sessionID: req.sessionID
      });
    });

    // STORAGE TEST PAGE (Kept for completeness)
    app.get("/test-storage", (req, res) => {
      console.log("🗄️ Storage test page accessed");
      res.render("storage-test", {
        title: "Storage Testing - Event Sphere"
      });
    });

    // Public API routes for session storage (Kept for completeness)
    app.post("/api/session/set", (req, res) => {
      try {
        const { key, value } = req.body;
        req.session[key] = value;
        console.log(`✅ API: Saved to Redis session: ${key}`);
        res.json({ success: true, key, value });
      } catch (error) {
        console.error("❌ API error:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    app.get("/api/session/get/:key", (req, res) => {
      try {
        const { key } = req.params;
        const value = req.session[key];
        console.log(`📖 API: Retrieved from Redis session: ${key}`);
        res.json({ success: true, key, value });
      } catch (error) {
        console.error("❌ API error:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // ... API Auth routes (JWT) ... (Kept for brevity, assuming they are imported/defined)

    app.post('/api/auth/login', async (req, res) => {
      try {
        const { username, password } = req.body;

        if (!username || !password) {
          return res.status(400).json({ success: false, message: 'Username and password required' });
        }

        const admin = await db.collection('admins').findOne({ username: username });

        if (!admin) {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const bcrypt = require('bcryptjs');
        let passwordMatches = false;

        if (admin.password && admin.password.startsWith('$2')) {
          passwordMatches = await bcrypt.compare(password, admin.password);
        } else {
          passwordMatches = admin.password === password;
        }

        if (!passwordMatches) {
          return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = signToken({ adminId: admin._id.toString(), username: admin.username }, process.env.JWT_EXPIRES || '1h');

        // Also set server session so browser navigations to server-rendered pages work
        try {
          req.session.isAdmin = true;
          req.session.adminId = admin._id.toString();
          req.session.adminUsername = admin.username;
        } catch (e) {
          console.warn('Could not set session during API login:', e.message || e);
        }

        res.json({ success: true, token, expiresIn: process.env.JWT_EXPIRES || '1h' });
      } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // HOME ROUTE (CACHED)
    app.get("/", async (req, res) => {
      const cacheKey = "events:featured";
      try {
        let featuredEvents = await getCachedData(cacheKey);

        if (!featuredEvents) {
          featuredEvents = await db.collection("events")
            .find()
            .sort({ date: 1 })
            .limit(3)
            .toArray();

          await setCachedData(cacheKey, featuredEvents);
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
      const cacheKey = "events:all";

      try {
        let events = await getCachedData(cacheKey);

        if (!events) {
          events = await db.collection("events").find().sort({ date: 1 }).toArray();
          await setCachedData(cacheKey, events);
        }

        res.render("events", { title: "Events - Event Sphere", events });
      } catch (error) {
        console.error("Error fetching events:", error);
        req.session.error = "Failed to load events";
        res.redirect("/");
      }
    });

    // EVENT DETAILS PAGE (Kept for completeness)
    app.get("/events/:id", async (req, res) => {
      try {
        const eventId = req.params.id;

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

    // CONTACT PAGE (Kept for completeness)
    app.get("/contact", (req, res) => {
      res.render("contact", { title: "Contact Us - Event Sphere" });
    });

    // CONTACT FORM SUBMISSION (Kept for completeness)
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

    // 1. GET /admin/login - Admin Login Page
    app.get("/admin/login", (req, res) => {
      if (req.session && req.session.isAdmin) {
        return res.redirect("/admin");
      }
      res.render("admin/login", {
        title: "Admin Login - Event Sphere"
      });
    });

    // 2. POST /admin/login - Handle Login Submission (Session-based)
    app.post("/admin/login", async (req, res) => {
      try {
        const { username, password } = req.body;

        // Find admin in DB
        const admin = await db.collection('admins').findOne({ username: username });

        // NOTE: Ensure 'bcryptjs' is installed (npm install bcryptjs) and required at the top of server.js
        const bcrypt = require('bcryptjs');
        let passwordMatches = false;

        if (admin && admin.password) {
          // Check for hashed password format
          if (admin.password.startsWith('$2')) {
            passwordMatches = await bcrypt.compare(password, admin.password);
          } else {
            // Fallback for non-hashed (simple) password
            passwordMatches = admin.password === password;
          }
        }

        if (admin && passwordMatches) {
          req.session.isAdmin = true;
          req.session.adminId = admin._id.toString();
          req.session.adminUsername = admin.username;
          req.session.success = "Logged in successfully!";
          res.redirect("/admin");
        } else {
          req.session.error = "Invalid username or password.";
          res.redirect("/admin/login");
        }
      } catch (error) {
        console.error("Login error:", error);
        req.session.error = "An error occurred during login.";
        res.redirect("/admin/login");
      }
    });

    // 3. GET /admin - Admin Dashboard (Requires Authentication)
    // 3. GET /admin - Admin Dashboard (Requires Authentication)
    app.get("/admin", requireAuth, async (req, res) => {
      try {
        // Fetch all events
        const events = await db.collection("events").find().sort({ date: -1 }).toArray();

        // 🆕 Fetch all contact submissions
        const contactSubmissions = await db.collection("contacts").find().sort({ timestamp: -1 }).toArray();

        res.render("admin/dashboard", {
          title: "Admin Dashboard - Event Sphere",
          events,
          // 🆕 Pass contactSubmissions to the template
          contactSubmissions
        });
      } catch (error) {
        console.error("Dashboard error:", error);
        req.session.error = "Failed to load dashboard data.";
        res.redirect("/admin/login");
      }
    });

    // 4. GET /admin/logout
    app.get("/admin/logout", (req, res) => {
      req.session.destroy(err => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/');
      });
    });

    // 5. GET /admin/events/:id/edit - Edit Event Page
    app.get("/admin/events/:id/edit", requireAuth, async (req, res) => {
      try {
        const eventId = req.params.id;
        if (!ObjectId.isValid(eventId)) {
          req.session.error = "Invalid event ID.";
          return res.redirect("/admin");
        }
        const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) });
        if (!event) {
          req.session.error = "Event not found.";
          return res.redirect("/admin");
        }
        res.render("admin/edit-event", {
          title: "Edit Event - Event Sphere",
          event
        });
      } catch (error) {
        console.error("Edit page error:", error);
        req.session.error = "Failed to load edit page.";
        res.redirect("/admin");
      }
    });

    // ADD EVENT (WITH CACHE INVALIDATION AND SOCKET.IO BROADCAST) 🆕
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
        const insertResult = await db.collection("events").insertOne(newEvent);
        const createdEvent = Object.assign({}, newEvent, { _id: insertResult.insertedId });

        // 1. Invalidate Cache
        await invalidateCache("events:*");

        // 2. ➡️ SOCKET.IO BROADCAST
        if (io) {
          // Emit the event data to all connected clients viewing /events
          io.emit("events:updated", { action: "created", event: createdEvent });
          console.log(`📣 WebSocket broadcast: events:updated for new event: ${createdEvent.title}`);
        }

        req.session.success = "Event added successfully!";
        res.redirect("/admin");
      } catch (error) {
        console.error("Error adding event:", error);
        req.session.error = "Failed to add event";
        res.redirect("/admin");
      }
    });

    // UPDATE EVENT (Kept for completeness)
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

        await invalidateCache("events:*");

        // TODO: Add Socket.IO broadcast for 'updated' event here later

        req.session.success = "Event updated successfully!";
        res.redirect("/admin");
      } catch (error) {
        console.error("Error updating event:", error);
        req.session.error = "Failed to update event";
        res.redirect("/admin");
      }
    });

    // DELETE EVENT (Kept for completeness)
    app.delete("/admin/events/:id", requireAuth, async (req, res) => {
      try {
        const eventId = new ObjectId(req.params.id);
        await db.collection("events").deleteOne({ _id: eventId });

        await invalidateCache("events:*");

        // TODO: Add Socket.IO broadcast for 'deleted' event here later

        req.session.success = "Event deleted successfully!";
        res.redirect("/admin");
      } catch (error) {
        console.error("Error deleting event:", error);
        req.session.error = "Failed to delete event";
        res.redirect("/admin");
      }
    });


    // ... remaining routes and handlers ...
    // ===============================
app.get("/admin/cache-stats", async (req, res) => {
  try {
    if (!req.session.isAdmin) {
      return res.redirect("/admin/login");
    }

    // Get Redis info
    const redisInfoRaw = await redisClient.info();
    const redisKeys = await redisClient.dbSize();

    // Format raw Redis INFO into an object
    const redisInfo = {};
    redisInfoRaw.split("\n").forEach(line => {
      if (line.includes(":")) {
        const [key, value] = line.split(":");
        redisInfo[key.trim()] = value.trim();
      }
    });

    // Get all keys and filter by pattern
    const allKeys = await redisClient.keys('*');
    const eventKeys = allKeys.filter(key => key.startsWith('events:'));
    const sessionKeys = allKeys.filter(key => key.startsWith('sess:'));
    const otherKeys = allKeys.filter(key => !key.startsWith('events:') && !key.startsWith('sess:'));

    // Calculate hit rate
    const hits = parseInt(redisInfo.keyspace_hits) || 0;
    const misses = parseInt(redisInfo.keyspace_misses) || 0;
    const total = hits + misses;
    const hitRate = total > 0 ? ((hits / total) * 100).toFixed(2) : 0;

    // Build stats object from Redis info
    const stats = {
      totalRequests: redisInfo.total_commands_processed || 0,
      connectedClients: redisInfo.connected_clients || 0,
      totalConnections: redisInfo.total_connections_received || 0,
      usedMemoryHuman: redisInfo.used_memory_human || "0MB",
      hits: hits,
      misses: misses
    };

    res.render("admin/cache-stats", {
      title: "Cache Statistics - Admin Panel",
      redisInfo,
      redisKeys,
      stats,
      hitRate,
      totalKeys: redisKeys,
      eventKeys,
      sessionKeys,
      otherKeys        // ← ADD THIS!
    });

  } catch (err) {
    console.error("❌ Error loading cache stats:", err);
    res.status(500).send("Error loading cache stats");
  }
});


    // 404 HANDLER

    app.use((req, res) => {
      res.status(404).render("404", { title: "Page Not Found - Event Sphere" });
    });

    console.log("✅ All routes registered successfully");

    // 🔄 FIXED: Listen on 0.0.0.0 to accept external connections
    const protocolName = serverOptions ? 'https' : 'http';
    const isProduction = process.env.NODE_ENV === 'production';
    
    httpServer.listen(PORT, '0.0.0.0', () => {
      const baseUrl = isProduction 
        ? (process.env.BASE_URL || 'https://eventsphere-anmol.onrender.com') 
        : `${protocolName}://localhost:${PORT}`;
      
      console.log(`\n🌐 Event Sphere server running at ${baseUrl}`);
      console.log(`📍 Test session at: ${baseUrl}/test-session\n`);
    });
  } catch (error) {
    console.error("🚨 Startup error:", error);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// ========================================
// 🛡️ AUTH MIDDLEWARE (Kept for completeness)
// ========================================
const requireAuth = (req, res, next) => {
  // ... existing requireAuth logic ...
  // 1) Allow session-based admin
  if (req.session && req.session.isAdmin) {
    return next();
  }

  // 2) Allow Bearer token (JWT) in Authorization header
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded) {
      req.jwtUser = decoded;
      return next();
    }
  }

  // Default: deny access
  if (req.session) req.session.error = 'Please log in to access the admin panel.';

  // If request expects JSON, return 401 JSON, otherwise redirect to login page
  if (req.accepts('json') || req.xhr || (req.headers['content-type'] && req.headers['content-type'].includes('application/json'))) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  return res.redirect('/admin/login');
};

// ========================================
// 🧠 REDIS CACHE HELPERS (Kept for completeness)
// ========================================
const CACHE_TTL = 300;

const cacheStats = {
  hits: 0,
  misses: 0,
  totalRequests: 0,
  getHitRate() {
    return this.totalRequests > 0
      ? ((this.hits / this.totalRequests) * 100).toFixed(2)
      : 0;
  }
};

async function getCachedData(key) {
  cacheStats.totalRequests++;

  try {
    const data = await redisClient.get(key);

    if (data) {
      cacheStats.hits++;
      console.log(`✅ Cache HIT for "${key}" | Hit Rate: ${cacheStats.getHitRate()}%`);
      return JSON.parse(data);
    } else {
      cacheStats.misses++;
      console.log(`⚡ Cache MISS for "${key}" | Hit Rate: ${cacheStats.getHitRate()}%`);
      return null;
    }
  } catch (error) {
    cacheStats.misses++;
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
// 🧹 GRACEFUL SHUTDOWN (Kept for completeness)
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