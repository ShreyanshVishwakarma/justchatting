import { createClient } from 'redis';


const redis = createClient({
    username: 'default',
    password: 'qz4Dax3gj5qKWz6HZPBqXtiDFi3seNKJ',
    socket: {
        host: 'redis-14111.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14111
    }
});

redis.on('error', (err) => console.log('Redis Client Error', err));
redis.on('connect', () => console.log('Redis Client Connected'));
redis.on('ready', () => console.log('Redis Client Ready'));
redis.on('reconnecting', () => console.log('Redis Client Reconnecting'));

// Connect to Redis with better error handling
let isConnecting = false;

async function ensureConnection() {
  if (redis.isOpen) return;
  
  if (isConnecting) {
    // Wait for existing connection attempt
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }

  try {
    isConnecting = true;
    await redis.connect();
    console.log('Connected to Redis successfully');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    throw error;
  } finally {
    isConnecting = false;
  }
}

// Initialize connection
if (!redis.isOpen && !isConnecting) {
  ensureConnection().catch(console.error);
}
// Helper functions for common operations
export const redisCache = {
  // Get data from cache
  async get(key: string) {
    try {
      await ensureConnection();
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  // Set data in cache with optional expiration
  async set(key: string, value: any, expirationInSeconds?: number) {
    try {
      await ensureConnection();
      const stringValue = JSON.stringify(value);
      if (expirationInSeconds) {
        await redis.setEx(key, expirationInSeconds, stringValue);
      } else {
        await redis.set(key, stringValue);
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  },

  // Delete data from cache
  async del(key: string) {
    try {
      await ensureConnection();
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  },

  // Check if key exists
  async exists(key: string) {
    try {
      await ensureConnection();
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  },

  // Get all keys matching a pattern
  async keys(pattern: string) {
    try {
      await ensureConnection();
      return await redis.keys(pattern);
    } catch (error) {
      console.error('Redis KEYS error:', error);
      return [];
    }
  },

  // Clear all cache (useful for development)
  async clear() {
    try {
      await ensureConnection();
      await redis.flushAll();
      return true;
    } catch (error) {
      console.error('Redis CLEAR error:', error);
      return false;
    }
  },

  // Get connection status
  isConnected() {
    return redis.isOpen;
  },
};

export default redis;

