import { gameCache } from './gameCache';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  shouldRetry?: (error: any) => boolean;
}

const defaultRetryOptions: RetryOptions = {
  maxRetries: 3,
  retryDelay: 1000,
  shouldRetry: (error) => {
    // Retry on network errors or 5xx server errors
    return !error.response || error.response.status >= 500;
  }
};

export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<T> {
  const { maxRetries, retryDelay, shouldRetry } = {
    ...defaultRetryOptions,
    ...retryOptions
  };

  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data as T;
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries && shouldRetry!(error)) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}

export function trackError(error: Error, context?: Record<string, any>) {
  // In production, this would send to Sentry or similar service
  if (process.env.NODE_ENV === 'production') {
    console.error('Error tracked:', error, context);
    // TODO: Implement actual error tracking service
  } else {
    console.error('Development error:', error, context);
  }
}

export function isOffline() {
  return !navigator.onLine;
}

export function getCachedData<T>(key: string): T | null {
  return gameCache.get<T>(key);
}

export function setCachedData<T>(key: string, data: T, expiresIn?: number) {
  gameCache.set(key, data, expiresIn);
} 