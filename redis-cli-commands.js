// 🔍 Redis CLI Commands Generator
// Run this to get commands you can paste into RedisInsight CLI

require("dotenv").config();

console.log("\n═══════════════════════════════════════════════════════");
console.log("🔴 REDIS CLI COMMANDS FOR REDISINSIGHT");
console.log("═══════════════════════════════════════════════════════\n");

console.log("📋 COPY AND PASTE THESE COMMANDS INTO REDISINSIGHT CLI:\n");

console.log("1️⃣  Check Connection:");
console.log("   PING\n");

console.log("2️⃣  Count Total Keys:");
console.log("   DBSIZE\n");

console.log("3️⃣  List ALL Keys:");
console.log("   KEYS *\n");

console.log("4️⃣  List Session Keys (Your Users):");
console.log("   KEYS sess:*\n");

console.log("5️⃣  List Event Cache Keys:");
console.log("   KEYS events:*\n");

console.log("6️⃣  Get Featured Events Cache:");
console.log("   GET events:featured\n");

console.log("7️⃣  Get All Events Cache:");
console.log("   GET events:all\n");

console.log("8️⃣  Check Cache Expiration Time:");
console.log("   TTL events:featured\n");

console.log("9️⃣  Check Memory Usage:");
console.log("   INFO memory\n");

console.log("🔟  Check Connected Clients:");
console.log("   CLIENT LIST\n");

console.log("═══════════════════════════════════════════════════════");
console.log("🌐 YOUR REDIS CLOUD CREDENTIALS:");
console.log("═══════════════════════════════════════════════════════");
console.log(`Host:     ${process.env.REDIS_HOST}`);
console.log(`Port:     ${process.env.REDIS_PORT}`);
console.log(`Password: ${process.env.REDIS_PASSWORD}`);
console.log("\n");

console.log("═══════════════════════════════════════════════════════");
console.log("📱 QUICK LINKS:");
console.log("═══════════════════════════════════════════════════════");
console.log("Redis Cloud Console: https://app.redislabs.com/");
console.log("RedisInsight Download: https://redis.com/redis-enterprise/redis-insight/");
console.log("\n");

console.log("═══════════════════════════════════════════════════════");
console.log("🧪 TEST SEQUENCE:");
console.log("═══════════════════════════════════════════════════════");
console.log("1. Start your server: node server.js");
console.log("2. Visit: http://localhost:3000/test-session");
console.log("3. In RedisInsight, run: KEYS sess:*");
console.log("4. You should see your session key!");
console.log("5. Visit: http://localhost:3000/");
console.log("6. In RedisInsight, run: GET events:featured");
console.log("7. You should see cached event data!");
console.log("\n✅ If you see data, Redis is working perfectly! 🎉\n");
