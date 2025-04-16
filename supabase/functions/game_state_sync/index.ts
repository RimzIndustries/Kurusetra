// Edge function for efficient game state synchronization
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GameStateUpdate {
  kingdomId: string;
  resources?: Record<string, any>;
  buildings?: Record<string, any>[];
  troops?: Record<string, any>[];
  lastUpdated: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      // Supabase API URL - env var from function deployment
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var from function deployment
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the user based on the JWT
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the request body
    const { action, data } = await req.json();

    if (action === "sync") {
      return await handleGameStateSync(supabaseClient, user.id, data);
    } else if (action === "fetch") {
      return await handleGameStateFetch(supabaseClient, user.id, data);
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleGameStateSync(
  supabaseClient: any,
  userId: string,
  data: GameStateUpdate,
) {
  const { kingdomId, resources, buildings, troops, lastUpdated } = data;

  // Verify the kingdom belongs to the user
  const { data: kingdom, error: kingdomError } = await supabaseClient
    .from("kingdoms")
    .select("id")
    .eq("id", kingdomId)
    .eq("user_id", userId)
    .single();

  if (kingdomError || !kingdom) {
    return new Response(
      JSON.stringify({ error: "Kingdom not found or unauthorized" }),
      {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Start a transaction for atomic updates
  const updates = [];

  // Update resources if provided
  if (resources) {
    for (const [resourceId, resourceData] of Object.entries(resources)) {
      const { data, error } = await supabaseClient
        .from("resources")
        .update({
          amount: resourceData.amount,
          capacity: resourceData.capacity,
          production_rate: resourceData.productionRate,
          last_updated: lastUpdated,
        })
        .eq("id", resourceId)
        .eq("kingdom_id", kingdomId);

      if (error)
        updates.push({
          type: "resource",
          id: resourceId,
          success: false,
          error,
        });
      else updates.push({ type: "resource", id: resourceId, success: true });
    }
  }

  // Update buildings if provided
  if (buildings) {
    for (const building of buildings) {
      const { data, error } = await supabaseClient
        .from("buildings")
        .update({
          level: building.level,
          construction_status: building.constructionStatus,
          completion_time: building.completionTime,
          health: building.health,
        })
        .eq("id", building.id)
        .eq("kingdom_id", kingdomId);

      if (error)
        updates.push({
          type: "building",
          id: building.id,
          success: false,
          error,
        });
      else updates.push({ type: "building", id: building.id, success: true });
    }
  }

  // Update troops if provided
  if (troops) {
    for (const troop of troops) {
      const { data, error } = await supabaseClient
        .from("troops")
        .update({
          count: troop.count,
          training_status: troop.trainingStatus,
          completion_time: troop.completionTime,
        })
        .eq("id", troop.id)
        .eq("kingdom_id", kingdomId);

      if (error)
        updates.push({ type: "troop", id: troop.id, success: false, error });
      else updates.push({ type: "troop", id: troop.id, success: true });
    }
  }

  // Update the kingdom's last updated timestamp
  const { error: kingdomUpdateError } = await supabaseClient
    .from("kingdoms")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", kingdomId);

  if (kingdomUpdateError) {
    updates.push({
      type: "kingdom",
      id: kingdomId,
      success: false,
      error: kingdomUpdateError,
    });
  } else {
    updates.push({ type: "kingdom", id: kingdomId, success: true });
  }

  return new Response(
    JSON.stringify({
      success: true,
      updates,
      timestamp: new Date().toISOString(),
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}

async function handleGameStateFetch(
  supabaseClient: any,
  userId: string,
  data: { kingdomId: string },
) {
  const { kingdomId } = data;

  // Verify the kingdom belongs to the user
  const { data: kingdom, error: kingdomError } = await supabaseClient
    .from("kingdoms")
    .select("*")
    .eq("id", kingdomId)
    .eq("user_id", userId)
    .single();

  if (kingdomError || !kingdom) {
    return new Response(
      JSON.stringify({ error: "Kingdom not found or unauthorized" }),
      {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Fetch all related data in parallel for better performance
  const [resourcesResult, buildingsResult, troopsResult, attacksResult] =
    await Promise.all([
      supabaseClient.from("resources").select("*").eq("kingdom_id", kingdomId),
      supabaseClient.from("buildings").select("*").eq("kingdom_id", kingdomId),
      supabaseClient.from("troops").select("*").eq("kingdom_id", kingdomId),
      supabaseClient
        .from("attacks")
        .select("*")
        .or(
          `source_kingdom_id.eq.${kingdomId},target_kingdom_id.eq.${kingdomId}`,
        )
        .not("status", "eq", "completed"),
    ]);

  // Format the response
  const gameState = {
    kingdom,
    resources: resourcesResult.data || [],
    buildings: buildingsResult.data || [],
    troops: troopsResult.data || [],
    attacks: attacksResult.data || [],
    lastUpdated: Date.now(),
  };

  return new Response(
    JSON.stringify({
      success: true,
      gameState,
      timestamp: new Date().toISOString(),
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
}
