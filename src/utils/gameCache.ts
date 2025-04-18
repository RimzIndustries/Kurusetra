interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class GameCache {
  private static instance: GameCache;
  private cache: Map<string, CacheItem<any>>;
  private readonly defaultExpiry = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): GameCache {
    if (!GameCache.instance) {
      GameCache.instance = new GameCache();
    }
    return GameCache.instance;
  }

  public set<T>(key: string, data: T, expiresIn: number = this.defaultExpiry): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public getSize(): number {
    return this.cache.size;
  }
}

export const gameCache = GameCache.getInstance(); 