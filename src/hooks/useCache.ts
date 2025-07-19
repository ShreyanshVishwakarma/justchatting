"use client";

import { useState, useEffect, useCallback } from 'react';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  refreshInterval?: number; // Auto refresh interval in seconds
  staleWhileRevalidate?: boolean; // Show cached data while fetching fresh
}

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { ttl = 300, refreshInterval, staleWhileRevalidate = true } = options;

  const fetchData = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      if (useCache) {
        // Try to get from cache first
        try {
          const response = await fetch(`/api/cache?key=${encodeURIComponent(key)}`);
          if (response.ok) {
            const cachedResult = await response.json();
            if (cachedResult.data) {
              setData(cachedResult.data);
              if (!staleWhileRevalidate) {
                setLoading(false);
                return;
              }
            }
          }
        } catch (cacheError) {
          console.warn('Cache retrieval failed:', cacheError);
        }
      }

      // Fetch fresh data
      const freshData = await fetcher();
      setData(freshData);

      // Cache the fresh data
      try {
        await fetch('/api/cache', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, data: freshData, ttl }),
        });
      } catch (cacheError) {
        console.warn('Cache storage failed:', cacheError);
      }

    } catch (err) {
      setError(err as Error);
      console.error('Data fetching error:', err);
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, staleWhileRevalidate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchData(false); // Skip cache on refresh
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchData]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
    // Update cache
    fetch('/api/cache', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, data: newData, ttl }),
    }).catch(error => console.warn('Cache update failed:', error));
  }, [key, ttl]);

  const invalidate = useCallback(() => {
    // Clear cache
    fetch(`/api/cache?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
    }).catch(error => console.warn('Cache invalidation failed:', error));
    
    // Refetch
    fetchData(false);
  }, [key, fetchData]);

  return {
    data,
    loading,
    error,
    mutate,
    invalidate,
    refresh: () => fetchData(false),
  };
}

// Specific hook for Convex data caching
export function useConvexCache<T>(
  key: string,
  convexData: T | undefined,
  options: CacheOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { ttl = 300 } = options;

  useEffect(() => {
    if (convexData !== undefined) {
      setData(convexData);
      setLoading(false);
      setError(null);

      // Cache the Convex data
      fetch('/api/cache', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data: convexData, ttl }),
      }).catch(error => console.warn('Cache storage failed:', error));
    }
  }, [convexData, key, ttl]);

  // Try to load from cache initially if Convex data is not available
  useEffect(() => {
    if (convexData === undefined && data === null) {
      fetch(`/api/cache?key=${encodeURIComponent(key)}`)
        .then(response => response.json())
        .then(result => {
          if (result.data) {
            setData(result.data);
            setLoading(false);
          }
        })
        .catch(error => {
          console.warn('Cache retrieval failed:', error);
          setError(error);
          setLoading(false);
        });
    }
  }, [convexData, key, data]);

  const invalidate = useCallback(() => {
    fetch(`/api/cache?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
    }).catch(error => console.warn('Cache invalidation failed:', error));
  }, [key]);

  return {
    data: convexData !== undefined ? convexData : data,
    loading: convexData === undefined ? loading : false,
    error,
    invalidate,
  };
}
