import { useState, useEffect } from 'react';
import { gameCache } from '../utils/gameCache';

interface UseGameCacheOptions<T> {
  key: string;
  fetchFn: () => Promise<T>;
  expiresIn?: number;
  enabled?: boolean;
}

export function useGameCache<T>({
  key,
  fetchFn,
  expiresIn,
  enabled = true
}: UseGameCacheOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      // Check cache first
      const cachedData = gameCache.get<T>(key);
      if (cachedData) {
        setData(cachedData);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const newData = await fetchFn();
        setData(newData);
        gameCache.set(key, newData, expiresIn);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [key, fetchFn, expiresIn, enabled]);

  const invalidate = () => {
    gameCache.delete(key);
    setData(null);
  };

  return {
    data,
    isLoading,
    error,
    invalidate
  };
} 