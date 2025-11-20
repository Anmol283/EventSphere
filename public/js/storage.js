// 🗄️ Event Sphere Storage Manager
// Manages localStorage, sessionStorage, and syncs with Redis server sessions

class StorageManager {
  constructor() {
    this.prefix = "eventsphere_";
    this.init();
  }

  init() {
    console.log("🚀 Event Sphere Storage Manager initialized");
    this.loadUserData();
    this.trackPageViews();
    this.loadPreferences();
    this.logStorageInfo();
  }

  // ========================================
  // 📦 LOCALSTORAGE METHODS (Persistent)
  // ========================================

  setLocal(key, value) {
    try {
      const fullKey = this.prefix + key;
      const data = {
        value: value,
        timestamp: new Date().toISOString(),
        expires: null,
      };
      localStorage.setItem(fullKey, JSON.stringify(data));
      console.log(`✅ localStorage SET: ${key}`, value);
      return true;
    } catch (error) {
      console.error("❌ localStorage error:", error);
      return false;
    }
  }

  getLocal(key) {
    try {
      const fullKey = this.prefix + key;
      const item = localStorage.getItem(fullKey);
      if (!item) return null;

      const data = JSON.parse(item);
      
      if (data.expires && new Date(data.expires) < new Date()) {
        this.removeLocal(key);
        return null;
      }

      console.log(`📖 localStorage GET: ${key}`, data.value);
      return data.value;
    } catch (error) {
      console.error("❌ localStorage error:", error);
      return null;
    }
  }

  removeLocal(key) {
    const fullKey = this.prefix + key;
    localStorage.removeItem(fullKey);
    console.log(`🗑️ localStorage REMOVE: ${key}`);
  }

  setLocalWithExpiry(key, value, expiryMinutes) {
    try {
      const fullKey = this.prefix + key;
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + expiryMinutes);

      const data = {
        value: value,
        timestamp: new Date().toISOString(),
        expires: expiryDate.toISOString(),
      };
      localStorage.setItem(fullKey, JSON.stringify(data));
      console.log(`✅ localStorage SET (${expiryMinutes}min TTL): ${key}`);
      return true;
    } catch (error) {
      console.error("❌ localStorage error:", error);
      return false;
    }
  }

  // ========================================
  // 🔄 SESSIONSTORAGE METHODS (Tab-specific)
  // ========================================

  setSession(key, value) {
    try {
      const fullKey = this.prefix + key;
      const data = {
        value: value,
        timestamp: new Date().toISOString(),
      };
      sessionStorage.setItem(fullKey, JSON.stringify(data));
      console.log(`✅ sessionStorage SET: ${key}`, value);
      return true;
    } catch (error) {
      console.error("❌ sessionStorage error:", error);
      return false;
    }
  }

  getSession(key) {
    try {
      const fullKey = this.prefix + key;
      const item = sessionStorage.getItem(fullKey);
      if (!item) return null;

      const data = JSON.parse(item);
      console.log(`📖 sessionStorage GET: ${key}`, data.value);
      return data.value;
    } catch (error) {
      console.error("❌ sessionStorage error:", error);
      return null;
    }
  }

  removeSession(key) {
    const fullKey = this.prefix + key;
    sessionStorage.removeItem(fullKey);
    console.log(`🗑️ sessionStorage REMOVE: ${key}`);
  }

  // ========================================
  // 🎯 FEATURE METHODS
  // ========================================

  loadUserData() {
    const userData = this.getLocal("user_data");
    if (userData) {
      console.log("👤 User data loaded:", userData);
    }
    return userData;
  }

  saveUserData(data) {
    this.setLocal("user_data", data);
  }

  trackPageViews() {
    const currentPage = window.location.pathname;
    
    let pageViews = this.getLocal("page_views") || {};
    pageViews[currentPage] = (pageViews[currentPage] || 0) + 1;
    this.setLocal("page_views", pageViews);

    let sessionViews = this.getSession("session_page_views") || 0;
    sessionViews++;
    this.setSession("session_page_views", sessionViews);

    console.log(`📊 Page: ${currentPage} | Total: ${pageViews[currentPage]} | Session: ${sessionViews}`);
  }

  loadPreferences() {
    const prefs = this.getLocal("preferences") || {
      theme: "light",
      notifications: true,
      language: "en",
    };
    
    if (prefs.theme === "dark") {
      document.body.classList.add("dark-mode");
    }

    console.log("⚙️ Preferences:", prefs);
    return prefs;
  }

  savePreferences(prefs) {
    this.setLocal("preferences", prefs);
  }

  trackEventVisit(eventId, eventTitle) {
    let visitedEvents = this.getLocal("visited_events") || [];
    
    const visit = {
      id: eventId,
      title: eventTitle,
      timestamp: new Date().toISOString(),
    };

    visitedEvents.unshift(visit);
    visitedEvents = visitedEvents.slice(0, 10);

    this.setLocal("visited_events", visitedEvents);
    console.log("🎫 Event visit tracked:", eventTitle);
  }

  getRecentlyVisited() {
    return this.getLocal("visited_events") || [];
  }

  saveFormData(formId, data) {
    this.setSession(`form_${formId}`, data);
  }

  getFormData(formId) {
    return this.getSession(`form_${formId}`);
  }

  clearFormData(formId) {
    this.removeSession(`form_${formId}`);
  }

  // ========================================
  // 🌐 SERVER SESSION (REDIS) METHODS
  // ========================================

  async saveToServer(key, value) {
    try {
      const response = await fetch("/api/session/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const result = await response.json();
      if (result.success) {
        console.log(`✅ Redis session SET: ${key}`, value);
      }
      return result;
    } catch (error) {
      console.error("❌ Server session error:", error);
      return null;
    }
  }

  async getFromServer(key) {
    try {
      const response = await fetch(`/api/session/get/${key}`);
      const result = await response.json();
      if (result.success) {
        console.log(`📖 Redis session GET: ${key}`, result.value);
      }
      return result.value;
    } catch (error) {
      console.error("❌ Server session error:", error);
      return null;
    }
  }

  async getAllServerSession() {
    try {
      const response = await fetch("/api/session/all");
      const result = await response.json();
      console.log("📊 All Redis session data:", result.session);
      return result.session;
    } catch (error) {
      console.error("❌ Server session error:", error);
      return null;
    }
  }

  async clearServerSession() {
    try {
      const response = await fetch("/api/session/clear", { method: "POST" });
      const result = await response.json();
      console.log("🧹 Redis session cleared");
      return result;
    } catch (error) {
      console.error("❌ Server session error:", error);
      return null;
    }
  }

  // ========================================
  // 🧹 CLEANUP & STATS
  // ========================================

  clearAll() {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
    console.log("🧹 All localStorage cleared");
  }

  clearSessionAll() {
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.prefix)) {
        sessionStorage.removeItem(key);
      }
    });
    console.log("🧹 All sessionStorage cleared");
  }

  getStats() {
    const localKeys = Object.keys(localStorage).filter(k => k.startsWith(this.prefix));
    const sessionKeys = Object.keys(sessionStorage).filter(k => k.startsWith(this.prefix));
    
    const stats = {
      localStorage: {
        count: localKeys.length,
        keys: localKeys.map(k => k.replace(this.prefix, "")),
      },
      sessionStorage: {
        count: sessionKeys.length,
        keys: sessionKeys.map(k => k.replace(this.prefix, "")),
      },
    };

    console.table(stats);
    return stats;
  }

  logStorageInfo() {
    console.log("\n💾 Storage Status:");
    console.log("  • localStorage keys:", Object.keys(localStorage).filter(k => k.startsWith(this.prefix)).length);
    console.log("  • sessionStorage keys:", Object.keys(sessionStorage).filter(k => k.startsWith(this.prefix)).length);
    console.log("\n💡 Console commands:");
    console.log("  storage.demo()     - Run demo");
    console.log("  storage.getStats() - View stats");
    console.log("  storage.setLocal('key', 'value')");
    console.log("  storage.getLocal('key')\n");
  }

  async demo() {
    console.log("\n🎯 === STORAGE DEMO ===\n");

    console.log("1️⃣ localStorage (persistent across browser closes):");
    this.setLocal("demo_user", { name: "John Doe", role: "admin" });
    console.log(this.getLocal("demo_user"));

    console.log("\n2️⃣ sessionStorage (cleared when tab closes):");
    this.setSession("demo_cart", ["Event Ticket 1", "Event Ticket 2"]);
    console.log(this.getSession("demo_cart"));

    console.log("\n3️⃣ localStorage with expiry (auto-delete after 5 min):");
    this.setLocalWithExpiry("demo_token", "abc123xyz", 5);

    console.log("\n4️⃣ Track event visit:");
    this.trackEventVisit("event123", "Music Festival 2025");

    console.log("\n5️⃣ Redis session (server-side, synced across devices):");
    await this.saveToServer("demo_server_data", { message: "Hello from Redis!" });
    const serverData = await this.getFromServer("demo_server_data");
    console.log("Retrieved from Redis:", serverData);

    console.log("\n6️⃣ Storage stats:");
    this.getStats();

    console.log("\n✅ Check: DevTools → Application → Storage → Local/Session Storage");
    console.log("✅ Check: Server console for Redis logs\n");
  }
}

// Initialize globally
const storage = new StorageManager();
window.storage = storage;

// Legacy API for backward compatibility
const Storage = {
  local: {
    setItem: (key, value) => storage.setLocal(key, value),
    getItem: (key) => storage.getLocal(key),
    removeItem: (key) => storage.removeLocal(key),
  },
  session: {
    setItem: (key, value) => storage.setSession(key, value),
    getItem: (key) => storage.getSession(key),
    removeItem: (key) => storage.removeSession(key),
  }
};

const StorageTest = {
  testStorage: () => {
    console.log("\n🧪 Running Storage Tests...\n");
    
    storage.setLocal('testKey', { test: 'Hello EventSphere!' });
    const localData = storage.getLocal('testKey');
    console.log('localStorage:', localData ? 'PASSED ✅' : 'FAILED ❌');
    
    storage.setSession('testKey', { test: 'Hello Session!' });
    const sessionData = storage.getSession('testKey');
    console.log('sessionStorage:', sessionData ? 'PASSED ✅' : 'FAILED ❌');
    
    return { localStorage: localData, sessionStorage: sessionData };
  }
};