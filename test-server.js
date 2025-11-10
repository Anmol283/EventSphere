const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");
require("dotenv").config();

const app = express();
const PORT = 3001; // Different port

// Redis setup
const redisClient = createClient({
  socket: {
    host: "redis-17731.c232.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 17731,
  },
  password: "Mz07h2ZI2aUpHEevzvHB77FGppADY1UA",
});

async function start() {
  await redisClient.connect();
  console.log("✅ Redis connected");

  // Session middleware
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: "test-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, httpOnly: true, maxAge: 3600000 },
    })
  );

  // Test route
  app.get("/test", (req, res) => {
    if (!req.session.views) req.session.views = 0;
    req.session.views++;
    res.json({
      message: "✅ Working!",
      views: req.session.views,
      sessionID: req.sessionID,
    });
  });

  app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}/test`);
  });
}

start().catch(console.error);