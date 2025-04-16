import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Utility functions to optimize Supabase operations
 */

// Cache for frequently accessed data
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute cache TTL

/**
 * Performs a cached database query
 * @param supabase Supabase client
 * @param table Table name
 * @param query Query function that returns a Supabase query builder
 * @param cacheKey Unique key for caching
 * @param ttl Optional custom TTL in ms
 */
export async function cachedQuery<T>(
  supabase: SupabaseClient,
  table: string,
  query: (builder: any) => any,
  cacheKey: string,
  ttl: number = CACHE_TTL,
): Promise<{ data: T | null; error: any }> {
  // Check cache first
  const cachedItem = cache.get(cacheKey);
  const now = Date.now();

  if (cachedItem && now - cachedItem.timestamp < ttl) {
    return { data: cachedItem.data, error: null };
  }

  // If not in cache or expired, fetch from Supabase
  try {
    const builder = supabase.from(table);
    const { data, error } = await query(builder);

    if (!error && data) {
      // Update cache
      cache.set(cacheKey, { data, timestamp: now });
    }

    return { data, error };
  } catch (error) {
    console.error(`Error in cachedQuery for ${table}:`, error);
    return { data: null, error };
  }
}

/**
 * Invalidates a specific cache entry or all entries for a table
 * @param cacheKey Specific cache key to invalidate, or table name to invalidate all related entries
 */
export function invalidateCache(cacheKey: string): void {
  // If it's an exact match, delete that specific entry
  if (cache.has(cacheKey)) {
    cache.delete(cacheKey);
    return;
  }

  // Otherwise, delete all entries that start with the key (table name)
  for (const key of cache.keys()) {
    if (key.startsWith(`${cacheKey}:`)) {
      cache.delete(key);
    }
  }
}

/**
 * Batch multiple inserts into a single operation
 * @param supabase Supabase client
 * @param table Table name
 * @param records Records to insert
 * @param batchSize Maximum batch size
 */
export async function batchInsert<T>(
  supabase: SupabaseClient,
  table: string,
  records: any[],
  batchSize: number = 100,
): Promise<{ data: T[] | null; error: any }> {
  if (!records.length) return { data: [], error: null };

  try {
    const results: T[] = [];
    let error = null;

    // Process in batches
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const { data, error: batchError } = await supabase
        .from(table)
        .insert(batch)
        .select();

      if (batchError) {
        error = batchError;
        break;
      }

      if (data) results.push(...data);
    }

    return { data: results.length ? results : null, error };
  } catch (error) {
    console.error(`Error in batchInsert for ${table}:`, error);
    return { data: null, error };
  }
}

/**
 * Optimized upsert operation with conflict handling
 * @param supabase Supabase client
 * @param table Table name
 * @param records Records to upsert
 * @param onConflict Column to handle conflicts
 * @param returning Whether to return the updated records
 */
export async function optimizedUpsert<T>(
  supabase: SupabaseClient,
  table: string,
  records: any[],
  onConflict: string,
  returning: boolean = true,
): Promise<{ data: T[] | null; error: any }> {
  if (!records.length) return { data: [], error: null };

  try {
    let query = supabase.from(table).upsert(records, { onConflict });

    if (returning) {
      query = query.select();
    }

    const { data, error } = await query;

    // Invalidate any cache entries for this table
    invalidateCache(table);

    return { data, error };
  } catch (error) {
    console.error(`Error in optimizedUpsert for ${table}:`, error);
    return { data: null, error };
  }
}

/**
 * Performs a transaction with multiple operations
 * @param supabase Supabase client
 * @param operations Array of SQL operations to perform
 */
export async function transaction(
  supabase: SupabaseClient,
  operations: string[],
): Promise<{ success: boolean; error: any }> {
  try {
    // Combine operations into a single transaction
    const transactionSQL = `
      BEGIN;
      ${operations.join(";\n")};
      COMMIT;
    `;

    const { error } = await supabase.rpc("exec_sql", { sql: transactionSQL });

    return { success: !error, error };
  } catch (error) {
    console.error("Transaction error:", error);
    return { success: false, error };
  }
}

/**
 * Subscribes to realtime changes with automatic reconnection
 * @param supabase Supabase client
 * @param table Table name
 * @param event Event type to listen for
 * @param callback Callback function when events occur
 * @param filter Optional filter function
 */
export function subscribeWithReconnect(
  supabase: SupabaseClient,
  table: string,
  event: "INSERT" | "UPDATE" | "DELETE" | "*",
  callback: (payload: any) => void,
  filter?: (payload: any) => boolean,
): { unsubscribe: () => void } {
  let subscription = supabase
    .channel(`table-changes-${table}`)
    .on("postgres_changes", { event, schema: "public", table }, (payload) => {
      if (!filter || filter(payload)) {
        callback(payload);
      }
    })
    .subscribe((status) => {
      console.log(`Subscription to ${table} status:`, status);
    });

  return {
    unsubscribe: () => {
      subscription.unsubscribe();
    },
  };
}
