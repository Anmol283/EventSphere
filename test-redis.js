// Quick Redis Test Script
const { createClient } = require("redis");
require("dotenv").config();

async function testRedis() {
  console.log("🔍 Testing Redis Connection...\n");

  const client = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    password: process.env.REDIS_PASSWORD,
  });

  client.on("error", (err) => console.error("❌ Error:", err));
  client.on("connect", () => console.log("✅ Connected to Redis Cloud"));
  client.on("ready", () => console.log("✅ Redis is ready\n"));

  try {
    await client.connect();

    // Test 1: Set and Get
    console.log("📝 Test 1: Setting a test key...");
    await client.set("test:key", "Hello Redis!");
    console.log("✅ Key set successfully\n");

    console.log("📖 Test 2: Reading the test key...");
    const value = await client.get("test:key");
    console.log(`✅ Retrieved value: "${value}"\n`);

    // Test 3: Check all keys
    console.log("🔑 Test 3: Listing all Redis keys...");
    const keys = await client.keys("*");
    console.log(`✅ Found ${keys.length} keys in Redis:`);
    keys.forEach((key, i) => {
      console.log(`   ${i + 1}. ${key}`);
    });
    console.log();

    // Test 4: Session keys
    const sessionKeys = keys.filter((k) => k.startsWith("sess:"));
    console.log(`🔐 Active sessions: ${sessionKeys.length}`);

    // Test 5: Cache keys
    const cacheKeys = keys.filter((k) => k.startsWith("events:"));
    console.log(`💾 Cached event data: ${cacheKeys.length}\n`);

    // Cleanup
    await client.del("test:key");
    console.log("🧹 Cleaned up test key");

    await client.quit();
    console.log("\n✅ All tests passed! Redis is working perfectly! 🎉");
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

testRedis();
