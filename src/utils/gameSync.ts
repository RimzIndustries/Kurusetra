import { supabase, setupRealtimeSubscription } from "./supabaseClient";

// Types for game data
type GameState = {
  userId: string;
  kingdomId: string;
  resources: Resources;
  buildings: Building[];
  military: Military;
  lastUpdated: string;
};

type Resources = {
  gold: number;
  food: number;
  wood: number;
  stone: number;
  iron: number;
};

type Building = {
  id: string;
  type: string;
  level: number;
  position: { x: number; y: number };
  status: "constructing" | "active" | "upgrading";
  completionTime?: string;
};

type Military = {
  units: { [unitType: string]: number };
  research: { [techName: string]: number };
};

// Function to fetch the latest game state
export async function fetchGameState(
  userId: string,
): Promise<GameState | null> {
  const { data, error } = await supabase
    .from("game_states")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching game state:", error);
    return null;
  }

  if (!data) return null;

  // Transform database data to application format
  return {
    userId: data.user_id,
    kingdomId: data.kingdom_id,
    resources: {
      gold: data.gold,
      food: data.food,
      wood: data.wood,
      stone: data.stone,
      iron: data.iron,
    },
    buildings: data.buildings || [],
    military: data.military || { units: {}, research: {} },
    lastUpdated: data.updated_at,
  };
}

// Function to save game state with optimistic updates
export async function saveGameState(gameState: GameState): Promise<boolean> {
  try {
    // Format data for database
    const dbData = {
      user_id: gameState.userId,
      kingdom_id: gameState.kingdomId,
      gold: gameState.resources.gold,
      food: gameState.resources.food,
      wood: gameState.resources.wood,
      stone: gameState.resources.stone,
      iron: gameState.resources.iron,
      buildings: gameState.buildings,
      military: gameState.military,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("game_states")
      .upsert(dbData, { onConflict: "user_id" });

    if (error) {
      console.error("Error saving game state:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error saving game state:", err);
    return false;
  }
}

// Function to set up realtime game state updates
export function setupGameStateSync(
  userId: string,
  onUpdate: (gameState: GameState) => void,
) {
  return setupRealtimeSubscription(
    "game_states",
    undefined,
    (payload) => {
      if (payload.new && payload.new.user_id === userId) {
        const newState: GameState = {
          userId: payload.new.user_id,
          kingdomId: payload.new.kingdom_id,
          resources: {
            gold: payload.new.gold,
            food: payload.new.food,
            wood: payload.new.wood,
            stone: payload.new.stone,
            iron: payload.new.iron,
          },
          buildings: payload.new.buildings || [],
          military: payload.new.military || { units: {}, research: {} },
          lastUpdated: payload.new.updated_at,
        };
        onUpdate(newState);
      }
    },
    undefined,
    `user_id=eq.${userId}`,
  );
}

// Function to handle resource production calculations
export function calculateResourceProduction(buildings: Building[]): Resources {
  const baseProduction: Resources = {
    gold: 10, // Base gold production per hour
    food: 20, // Base food production per hour
    wood: 15, // Base wood production per hour
    stone: 8, // Base stone production per hour
    iron: 5, // Base iron production per hour
  };

  // Calculate production bonuses from buildings
  buildings.forEach((building) => {
    if (building.status !== "active") return;

    switch (building.type) {
      case "farm":
        baseProduction.food += 10 * building.level;
        break;
      case "lumbermill":
        baseProduction.wood += 8 * building.level;
        break;
      case "mine":
        baseProduction.stone += 5 * building.level;
        baseProduction.iron += 3 * building.level;
        break;
      case "market":
        baseProduction.gold += 15 * building.level;
        break;
      // Add more building types as needed
    }
  });

  return baseProduction;
}

// Function to apply resource production based on elapsed time
export function applyResourceProduction(gameState: GameState): GameState {
  const now = new Date();
  const lastUpdate = new Date(gameState.lastUpdated);
  const hoursSinceLastUpdate =
    (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

  // Don't update if less than 5 minutes have passed
  if (hoursSinceLastUpdate < 0.083) return gameState;

  const production = calculateResourceProduction(gameState.buildings);

  // Apply production based on time elapsed
  const updatedResources = {
    gold: gameState.resources.gold + production.gold * hoursSinceLastUpdate,
    food: gameState.resources.food + production.food * hoursSinceLastUpdate,
    wood: gameState.resources.wood + production.wood * hoursSinceLastUpdate,
    stone: gameState.resources.stone + production.stone * hoursSinceLastUpdate,
    iron: gameState.resources.iron + production.iron * hoursSinceLastUpdate,
  };

  return {
    ...gameState,
    resources: updatedResources,
    lastUpdated: now.toISOString(),
  };
}
