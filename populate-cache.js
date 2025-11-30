// 🚀 Populate Redis Cache Script
// This script visits your pages to create cache entries in Redis

const http = require('http');

console.log('\n🎯 POPULATING REDIS CACHE...\n');

// Function to make HTTP request
function visitPage(path, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`✅ ${description} - Cache created!`);
        resolve(data);
      });
    });

    req.on('error', (err) => {
      console.error(`❌ Error visiting ${path}:`, err.message);
      reject(err);
    });

    req.end();
  });
}

// Main function
async function populateCache() {
  console.log('⏳ Make sure your server is running: node server.js\n');
  
  // Wait a bit for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Visit homepage to cache featured events
    await visitPage('/', 'Homepage visited (events:featured)');
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Visit events page to cache all events
    await visitPage('/events', 'Events page visited (events:all)');
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Visit test-session to create a session
    await visitPage('/test-session', 'Test session page visited (sess:xxx)');

    console.log('\n🎉 SUCCESS! Cache populated!\n');
    console.log('📋 Now check RedisInsight and run these commands:');
    console.log('   KEYS *');
    console.log('   KEYS events:*');
    console.log('   GET events:featured');
    console.log('   GET events:all');
    console.log('\n✅ You should see your cached event data!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Make sure your server is running:');
    console.log('   1. Open a terminal');
    console.log('   2. Run: node server.js');
    console.log('   3. Then run this script again\n');
  }
}

// Check if server is running first
http.get('http://localhost:3000/', (res) => {
  console.log('✅ Server is running!\n');
  populateCache();
}).on('error', (err) => {
  console.error('❌ Server is not running!');
  console.log('\n💡 Please start your server first:');
  console.log('   1. Open a NEW terminal window');
  console.log('   2. Run: node server.js');
  console.log('   3. Keep it running');
  console.log('   4. Then run this script: node populate-cache.js\n');
  process.exit(1);
});
