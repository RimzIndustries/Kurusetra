import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResourceCalculationRequest {
  userId: string;
  lastCalculationTime?: string;
}

interface ResourceProduction {
  gold: number;
  food: number;
  wood: number;
  stone: number;
  iron: number;
}

interface Building {
  type: string;
  level: number;
  status: "constructing" | "active" | "upgrading";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Get request data
    const { userId, lastCalculationTime } =
      (await req.json()) as ResourceCalculationRequest;

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get user's kingdom
    const { data: kingdomData, error: kingdomError } = await supabaseClient
      .from("kingdoms")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (kingdomError || !kingdomData) {
      return new Response(
        JSON.stringify({ error: "Kingdom not found", details: kingdomError }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    const kingdomId = kingdomData.id;

    // Get active buildings
    const { data: buildings, error: buildingsError } = await supabaseClient
      .from("buildings")
      .select("type, level, status")
      .eq("kingdom_id", kingdomId)
      .eq("status", "active");

    if (buildingsError) {
      return new Response(
        JSON.stringify({
          error: "Error fetching buildings",
          details: buildingsError,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Calculate base production rates
    const baseProduction: ResourceProduction = {
      gold: 10,
      food: 20,
      wood: 15,
      stone: 8,
      iron: 5,
    };

    // Apply building bonuses
    const production = (buildings || []).reduce(
      (acc: ResourceProduction, building: Building) => {
        switch (building.type) {
          case "farm":
            acc.food += 10 * building.level;
            break;
          case "lumbermill":
            acc.wood += 8 * building.level;
            break;
          case "mine":
            acc.stone += 5 * building.level;
            acc.iron += 3 * building.level;
            break;
          case "market":
            acc.gold += 15 * building.level;
            break;
        }
        return acc;
      },
      { ...baseProduction },
    );

    // Calculate resources gained since last calculation if timestamp provided
    let resourcesGained = null;
    if (lastCalculationTime) {
      const lastCalc = new Date(lastCalculationTime);
      const now = new Date();
      const hoursSinceLastCalc =
        (now.getTime() - lastCalc.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastCalc > 0) {
        resourcesGained = {
          gold: production.gold * hoursSinceLastCalc,
          food: production.food * hoursSinceLastCalc,
          wood: production.wood * hoursSinceLastCalc,
          stone: production.stone * hoursSinceLastCalc,
          iron: production.iron * hoursSinceLastCalc,
        };
      }
    }

    return new Response(
      JSON.stringify({
        production,
        resourcesGained,
        calculationTime: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
