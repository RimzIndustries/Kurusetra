import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Types for game state management
type GameState = {
  kingdoms: Kingdom[];
  resources: Record<string, Resource>;
  buildings: Record<string, Building[]>;
  troops: Record<string, Troop[]>;
  attacks: Attack[];
  lastUpdated: number;
};

type Kingdom = {
  id: string;
  userId: string;
  name: string;
  race: string;
  strength: number;
  location: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
};

type Resource = {
  id: string;
  kingdomId: string;
  type: "gold" | "food" | "materials";
  amount: number;
  capacity: number;
  productionRate: number;
  lastUpdated: number;
};

type Building = {
  id: string;
  kingdomId: string;
  type: string;
  level: number;
  constructionStatus: "idle" | "upgrading" | "constructing";
  completionTime: number | null;
  health: number;
};

type Troop = {
  id: string;
  kingdomId: string;
  type: string;
  count: number;
  power: number;
  speed: number;
  trainingStatus: "idle" | "training";
  completionTime: number | null;
};

type Attack = {
  id: string;
  sourceKingdomId: string;
  targetKingdomId: string;
  troops: Record<string, number>;
  spies: Record<string, number>;
  status: "pending" | "traveling" | "completed" | "failed";
  startTime: number;
  completionTime: number;
  result?: AttackResult;
};

type AttackResult = {
  success: boolean;
  troopsLost: Record<string, number>;
  resourcesGained?: Record<string, number>;
  buildingsDamaged?: Record<string, number>;
  message: string;
};

// Server-side game state manager
export class GameStateManager {
  private supabase: SupabaseClient;
  private gameStates: Map<string, GameState> = new Map();
  private dirtyStates: Set<string> = new Set();
  private saveInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_KEY as string,
    );

    // Start periodic state saving
    this.saveInterval = setInterval(() => this.saveAllDirtyStates(), 30000); // Save every 30 seconds
  }

  // Load a kingdom's game state
  async loadGameState(kingdomId: string): Promise<GameState | null> {
    // Check if we already have it in memory
    if (this.gameStates.has(kingdomId)) {
      return this.gameStates.get(kingdomId) || null;
    }

    try {
      // Load kingdom data
      const { data: kingdomData, error: kingdomError } = await this.supabase
        .from("kingdoms")
        .select("*")
        .eq("id", kingdomId)
        .single();

      if (kingdomError || !kingdomData) {
        console.error("Error loading kingdom:", kingdomError);
        return null;
      }

      // Load resources
      const { data: resourcesData, error: resourcesError } = await this.supabase
        .from("resources")
        .select("*")
        .eq("kingdom_id", kingdomId);

      if (resourcesError) {
        console.error("Error loading resources:", resourcesError);
        return null;
      }

      // Load buildings
      const { data: buildingsData, error: buildingsError } = await this.supabase
        .from("buildings")
        .select("*")
        .eq("kingdom_id", kingdomId);

      if (buildingsError) {
        console.error("Error loading buildings:", buildingsError);
        return null;
      }

      // Load troops
      const { data: troopsData, error: troopsError } = await this.supabase
        .from("troops")
        .select("*")
        .eq("kingdom_id", kingdomId);

      if (troopsError) {
        console.error("Error loading troops:", troopsError);
        return null;
      }

      // Load active attacks
      const { data: attacksData, error: attacksError } = await this.supabase
        .from("attacks")
        .select("*")
        .or(
          `source_kingdom_id.eq.${kingdomId},target_kingdom_id.eq.${kingdomId}`,
        )
        .not("status", "eq", "completed");

      if (attacksError) {
        console.error("Error loading attacks:", attacksError);
        return null;
      }

      // Format the game state
      const gameState: GameState = {
        kingdoms: [kingdomData],
        resources: {},
        buildings: {},
        troops: {},
        attacks: [],
        lastUpdated: Date.now(),
      };

      // Process resources
      resourcesData.forEach((resource) => {
        if (!gameState.resources[resource.kingdom_id]) {
          gameState.resources[resource.kingdom_id] = {
            id: resource.id,
            kingdomId: resource.kingdom_id,
            type: resource.type,
            amount: resource.amount,
            capacity: resource.capacity,
            productionRate: resource.production_rate,
            lastUpdated: resource.last_updated,
          } as Resource;
        }
      });

      // Process buildings
      buildingsData.forEach((building) => {
        if (!gameState.buildings[building.kingdom_id]) {
          gameState.buildings[building.kingdom_id] = [];
        }
        gameState.buildings[building.kingdom_id].push({
          id: building.id,
          kingdomId: building.kingdom_id,
          type: building.type,
          level: building.level,
          constructionStatus: building.construction_status,
          completionTime: building.completion_time,
          health: building.health,
        } as Building);
      });

      // Process troops
      troopsData.forEach((troop) => {
        if (!gameState.troops[troop.kingdom_id]) {
          gameState.troops[troop.kingdom_id] = [];
        }
        gameState.troops[troop.kingdom_id].push({
          id: troop.id,
          kingdomId: troop.kingdom_id,
          type: troop.type,
          count: troop.count,
          power: troop.power,
          speed: troop.speed,
          trainingStatus: troop.training_status,
          completionTime: troop.completion_time,
        } as Troop);
      });

      // Process attacks
      attacksData.forEach((attack) => {
        gameState.attacks.push({
          id: attack.id,
          sourceKingdomId: attack.source_kingdom_id,
          targetKingdomId: attack.target_kingdom_id,
          troops: attack.troops,
          spies: attack.spies,
          status: attack.status,
          startTime: attack.start_time,
          completionTime: attack.completion_time,
          result: attack.result,
        } as Attack);
      });

      // Cache the state
      this.gameStates.set(kingdomId, gameState);
      return gameState;
    } catch (error) {
      console.error("Error in loadGameState:", error);
      return null;
    }
  }

  // Save a kingdom's game state
  async saveGameState(kingdomId: string): Promise<boolean> {
    const gameState = this.gameStates.get(kingdomId);
    if (!gameState) return false;

    try {
      // Update kingdom data
      const kingdom = gameState.kingdoms[0];
      const { error: kingdomError } = await this.supabase
        .from("kingdoms")
        .update({
          name: kingdom.name,
          strength: kingdom.strength,
          location: kingdom.location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", kingdom.id);

      if (kingdomError) {
        console.error("Error saving kingdom:", kingdomError);
        return false;
      }

      // Update resources
      for (const kingdomId in gameState.resources) {
        const resource = gameState.resources[kingdomId];
        const { error: resourceError } = await this.supabase
          .from("resources")
          .update({
            amount: resource.amount,
            capacity: resource.capacity,
            production_rate: resource.productionRate,
            last_updated: Date.now(),
          })
          .eq("id", resource.id);

        if (resourceError) {
          console.error("Error saving resource:", resourceError);
          return false;
        }
      }

      // Update buildings
      for (const kingdomId in gameState.buildings) {
        for (const building of gameState.buildings[kingdomId]) {
          const { error: buildingError } = await this.supabase
            .from("buildings")
            .update({
              level: building.level,
              construction_status: building.constructionStatus,
              completion_time: building.completionTime,
              health: building.health,
            })
            .eq("id", building.id);

          if (buildingError) {
            console.error("Error saving building:", buildingError);
            return false;
          }
        }
      }

      // Update troops
      for (const kingdomId in gameState.troops) {
        for (const troop of gameState.troops[kingdomId]) {
          const { error: troopError } = await this.supabase
            .from("troops")
            .update({
              count: troop.count,
              training_status: troop.trainingStatus,
              completion_time: troop.completionTime,
            })
            .eq("id", troop.id);

          if (troopError) {
            console.error("Error saving troop:", troopError);
            return false;
          }
        }
      }

      // Update attacks
      for (const attack of gameState.attacks) {
        const { error: attackError } = await this.supabase
          .from("attacks")
          .update({
            status: attack.status,
            completion_time: attack.completionTime,
            result: attack.result,
          })
          .eq("id", attack.id);

        if (attackError) {
          console.error("Error saving attack:", attackError);
          return false;
        }
      }

      // Update last updated timestamp
      gameState.lastUpdated = Date.now();
      this.dirtyStates.delete(kingdomId);
      return true;
    } catch (error) {
      console.error("Error in saveGameState:", error);
      return false;
    }
  }

  // Mark a game state as dirty (needs saving)
  markStateDirty(kingdomId: string): void {
    this.dirtyStates.add(kingdomId);
  }

  // Save all dirty states
  async saveAllDirtyStates(): Promise<void> {
    const dirtyStateIds = Array.from(this.dirtyStates);
    for (const kingdomId of dirtyStateIds) {
      await this.saveGameState(kingdomId);
    }
  }

  // Process a client action and update the game state
  async processAction(action: any): Promise<{ success: boolean; result: any }> {
    try {
      const { type, kingdomId, data } = action;

      // Load the game state if not already loaded
      let gameState = this.gameStates.get(kingdomId);
      if (!gameState) {
        gameState = await this.loadGameState(kingdomId);
        if (!gameState) {
          return {
            success: false,
            result: { error: "Failed to load game state" },
          };
        }
      }

      // Process different action types
      switch (type) {
        case "ATTACK":
          return await this.processAttackAction(gameState, data);
        case "BUILD":
          return await this.processBuildAction(gameState, data);
        case "TRAIN":
          return await this.processTrainAction(gameState, data);
        case "RESEARCH":
          return await this.processResearchAction(gameState, data);
        default:
          return { success: false, result: { error: "Unknown action type" } };
      }
    } catch (error) {
      console.error("Error processing action:", error);
      return {
        success: false,
        result: { error: "Server error processing action" },
      };
    }
  }

  // Process an attack action
  private async processAttackAction(
    gameState: GameState,
    data: any,
  ): Promise<{ success: boolean; result: any }> {
    const { targetKingdomId, troops, spies, attackTime } = data;

    // Validate the attack
    const sourceKingdom = gameState.kingdoms[0];

    // Check if the kingdom has the troops/spies it's trying to send
    const kingdomTroops = gameState.troops[sourceKingdom.id] || [];
    for (const troopId in troops) {
      const troop = kingdomTroops.find((t) => t.id === troopId);
      if (!troop || troop.count < troops[troopId]) {
        return {
          success: false,
          result: { error: "Not enough troops available for attack" },
        };
      }
    }

    // Calculate travel time based on distance and slowest unit
    const targetKingdom = await this.getKingdomById(targetKingdomId);
    if (!targetKingdom) {
      return { success: false, result: { error: "Target kingdom not found" } };
    }

    // Calculate distance between kingdoms
    const distance = this.calculateDistance(
      sourceKingdom.location,
      targetKingdom.location,
    );

    // Find the slowest troop to calculate travel time
    let slowestSpeed = Infinity;
    for (const troopId in troops) {
      if (troops[troopId] > 0) {
        const troop = kingdomTroops.find((t) => t.id === troopId);
        if (troop && troop.speed < slowestSpeed) {
          slowestSpeed = troop.speed;
        }
      }
    }

    // Default speed if no troops selected
    if (slowestSpeed === Infinity) slowestSpeed = 1;

    // Calculate travel time in milliseconds
    const travelTimeHours = Math.ceil(distance / slowestSpeed);
    const travelTimeMs = travelTimeHours * 60 * 60 * 1000;

    // Calculate completion time
    const startTime = Date.now() + attackTime * 60 * 60 * 1000; // Add delay if specified
    const completionTime = startTime + travelTimeMs;

    // Create the attack record
    const attackId = `attack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const attack: Attack = {
      id: attackId,
      sourceKingdomId: sourceKingdom.id,
      targetKingdomId,
      troops,
      spies: spies || {},
      status: "pending",
      startTime,
      completionTime,
    };

    // Add to game state
    gameState.attacks.push(attack);

    // Deduct troops from source kingdom
    for (const troopId in troops) {
      const troopIndex = kingdomTroops.findIndex((t) => t.id === troopId);
      if (troopIndex >= 0) {
        kingdomTroops[troopIndex].count -= troops[troopId];
      }
    }

    // Mark state as dirty
    this.markStateDirty(sourceKingdom.id);

    // Save the attack to the database
    const { error } = await this.supabase.from("attacks").insert({
      id: attackId,
      source_kingdom_id: sourceKingdom.id,
      target_kingdom_id: targetKingdomId,
      troops,
      spies: spies || {},
      status: "pending",
      start_time: startTime,
      completion_time: completionTime,
    });

    if (error) {
      console.error("Error saving attack to database:", error);
      return { success: false, result: { error: "Failed to save attack" } };
    }

    return {
      success: true,
      result: {
        attackId,
        travelTime: `${travelTimeHours} hours`,
        startTime,
        completionTime,
      },
    };
  }

  // Process a build action
  private async processBuildAction(
    gameState: GameState,
    data: any,
  ): Promise<{ success: boolean; result: any }> {
    // Implementation for building construction/upgrade
    // This is a placeholder - implement the actual logic
    return { success: true, result: { message: "Building action processed" } };
  }

  // Process a troop training action
  private async processTrainAction(
    gameState: GameState,
    data: any,
  ): Promise<{ success: boolean; result: any }> {
    // Implementation for troop training
    // This is a placeholder - implement the actual logic
    return { success: true, result: { message: "Training action processed" } };
  }

  // Process a research action
  private async processResearchAction(
    gameState: GameState,
    data: any,
  ): Promise<{ success: boolean; result: any }> {
    // Implementation for research
    // This is a placeholder - implement the actual logic
    return { success: true, result: { message: "Research action processed" } };
  }

  // Helper method to get a kingdom by ID
  private async getKingdomById(kingdomId: string): Promise<Kingdom | null> {
    try {
      const { data, error } = await this.supabase
        .from("kingdoms")
        .select("*")
        .eq("id", kingdomId)
        .single();

      if (error || !data) {
        console.error("Error fetching kingdom:", error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        race: data.race,
        strength: data.strength,
        location: data.location,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as Kingdom;
    } catch (error) {
      console.error("Error in getKingdomById:", error);
      return null;
    }
  }

  // Calculate distance between two locations
  private calculateDistance(
    loc1: { x: number; y: number },
    loc2: { x: number; y: number },
  ): number {
    return Math.sqrt(
      Math.pow(loc2.x - loc1.x, 2) + Math.pow(loc2.y - loc1.y, 2),
    );
  }

  // Clean up resources
  cleanup(): void {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    this.saveAllDirtyStates().catch(console.error);
  }
}

// Create a singleton instance
export const gameStateManager = new GameStateManager();

// Export validation functions for client-side use
export const validateAttack = (
  data: any,
): { valid: boolean; error?: string } => {
  const { targetKingdomId, troops, spies } = data;

  if (!targetKingdomId) {
    return { valid: false, error: "Target kingdom is required" };
  }

  if (!troops || Object.keys(troops).length === 0) {
    return { valid: false, error: "No troops selected for attack" };
  }

  // Check if any troops have negative or non-integer values
  for (const troopId in troops) {
    const count = troops[troopId];
    if (!Number.isInteger(count) || count < 0) {
      return { valid: false, error: "Invalid troop count" };
    }
  }

  // If spies are included, validate them too
  if (spies) {
    for (const spyId in spies) {
      const count = spies[spyId];
      if (!Number.isInteger(count) || count < 0) {
        return { valid: false, error: "Invalid spy count" };
      }
    }
  }

  return { valid: true };
};

export const validateBuild = (
  data: any,
): { valid: boolean; error?: string } => {
  // Implementation for build validation
  // This is a placeholder - implement the actual validation
  return { valid: true };
};

export const validateTrain = (
  data: any,
): { valid: boolean; error?: string } => {
  // Implementation for train validation
  // This is a placeholder - implement the actual validation
  return { valid: true };
};

export const validateResearch = (
  data: any,
): { valid: boolean; error?: string } => {
  // Implementation for research validation
  // This is a placeholder - implement the actual validation
  return { valid: true };
};
