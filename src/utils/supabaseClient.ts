import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

// Create a single supabase client for interacting with your database
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      "x-application-name": "kurusetra-game",
    },
    fetch: fetch,
  },
});

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error);
  return {
    error:
      error instanceof Error
        ? error
        : new Error(error.message || "Unknown error"),
    data: null,
  };
};

// Helper function to optimize queries with proper error handling
export async function optimizedQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  context: string,
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data, error } = await queryFn();

    if (error) {
      return handleSupabaseError(error, context);
    }

    return { data, error: null };
  } catch (error) {
    return handleSupabaseError(error, context);
  }
}

// Helper function to batch operations for better performance
export async function batchOperations<T>(
  operations: Array<() => Promise<{ data: any; error: any }>>,
  context: string,
): Promise<{ results: any[]; errors: Error[] }> {
  const results: any[] = [];
  const errors: Error[] = [];

  await Promise.all(
    operations.map(async (operation) => {
      try {
        const { data, error } = await operation();

        if (error) {
          errors.push(
            error instanceof Error
              ? error
              : new Error(error.message || "Unknown error"),
          );
        } else {
          results.push(data);
        }
      } catch (error: any) {
        errors.push(
          error instanceof Error
            ? error
            : new Error(error?.message || "Unknown error"),
        );
      }
    }),
  );

  return { results, errors };
}

// Helper function to handle realtime subscriptions
export function setupRealtimeSubscription(
  table: string,
  onInsert?: (payload: any) => void,
  onUpdate?: (payload: any) => void,
  onDelete?: (payload: any) => void,
  filter?: string,
) {
  let channel = supabase
    .channel(`${table}-changes`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table,
        filter,
      },
      (payload) => onInsert && onInsert(payload),
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table,
        filter,
      },
      (payload) => onUpdate && onUpdate(payload),
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table,
        filter,
      },
      (payload) => onDelete && onDelete(payload),
    )
    .subscribe((status) => {
      console.log(`Realtime subscription to ${table}: ${status}`);
    });

  return {
    unsubscribe: () => {
      channel.unsubscribe();
    },
  };
}
