// Redis client disabled — replaced with a no-op stub because this app
// doesn't require Redis in your current environment. This prevents the
// app from attempting to connect to an unavailable Redis host and
// spamming reconnection logs.

// If you want to re-enable Redis, replace this file with the previous
// implementation that creates a redis client and exports `redisCache`.

export const redisCache = {
  async get(_key: string) {
    return null;
  },
  async set(_key: string, _value: any, _expirationInSeconds?: number) {
    return true;
  },
  async del(_key: string) {
    return true;
  },
  async exists(_key: string) {
    return false;
  },
  async keys(_pattern: string) {
    return [] as string[];
  },
  async clear() {
    return true;
  },
  isConnected() {
    return false;
  },
};

export default null;
