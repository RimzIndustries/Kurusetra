import { useState, useEffect, useCallback } from 'react';
import { GameState, Player, Resources, Building, MilitaryUnit, Policy } from '../types/game';
import { useToast } from './useToast';

const INITIAL_RESOURCES: Resources = {
  gold: 1000,
  wood: 500,
  stone: 500,
  food: 1000,
  goldProduction: 0,
  woodProduction: 0,
  stoneProduction: 0,
  foodProduction: 0,
};

const INITIAL_PLAYER: Player = {
  id: '1',
  name: 'Player',
  level: 1,
  exp: 0,
  resources: INITIAL_RESOURCES,
  buildings: [],
  militaryUnits: [],
  policies: [],
  influence: 0,
  happiness: 100,
  productionBonus: 0,
  militaryBonus: 0,
  health: 100,
  maxHealth: 100,
  attack: 10,
  defense: 10,
};

const INITIAL_STATE: GameState = {
  player: INITIAL_PLAYER,
  lastUpdated: new Date(),
  isOnline: true,
  isInBattle: false,
  currentLocation: 'home',
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const { addToast } = useToast();

  // Update resources based on production
  const updateResources = useCallback(() => {
    setGameState(prev => {
      const newResources = { ...prev.player.resources };
      newResources.gold += newResources.goldProduction;
      newResources.wood += newResources.woodProduction;
      newResources.stone += newResources.stoneProduction;
      newResources.food += newResources.foodProduction;

      return {
        ...prev,
        player: {
          ...prev.player,
          resources: newResources,
        },
        lastUpdated: new Date(),
      };
    });
  }, []);

  // Update production based on buildings
  const updateProduction = useCallback(() => {
    setGameState(prev => {
      const newResources = { ...prev.player.resources };
      newResources.goldProduction = 0;
      newResources.woodProduction = 0;
      newResources.stoneProduction = 0;
      newResources.foodProduction = 0;

      prev.player.buildings.forEach(building => {
        if (building.production.gold) newResources.goldProduction += building.production.gold;
        if (building.production.wood) newResources.woodProduction += building.production.wood;
        if (building.production.stone) newResources.stoneProduction += building.production.stone;
        if (building.production.food) newResources.foodProduction += building.production.food;
      });

      return {
        ...prev,
        player: {
          ...prev.player,
          resources: newResources,
        },
      };
    });
  }, []);

  // Add building
  const addBuilding = useCallback((building: Building) => {
    setGameState(prev => {
      const newBuildings = [...prev.player.buildings, building];
      return {
        ...prev,
        player: {
          ...prev.player,
          buildings: newBuildings,
        },
      };
    });
    updateProduction();
    addToast({
      message: `${building.name} built successfully!`,
      type: 'success',
    });
  }, [updateProduction, addToast]);

  // Upgrade building
  const upgradeBuilding = useCallback((buildingId: string) => {
    setGameState(prev => {
      const newBuildings = prev.player.buildings.map(building => {
        if (building.id === buildingId) {
          return {
            ...building,
            level: building.level + 1,
            cost: {
              gold: building.cost.gold * 1.5,
              wood: building.cost.wood * 1.5,
              stone: building.cost.stone * 1.5,
            },
            production: {
              gold: building.production.gold ? building.production.gold * 1.2 : undefined,
              wood: building.production.wood ? building.production.wood * 1.2 : undefined,
              stone: building.production.stone ? building.production.stone * 1.2 : undefined,
              food: building.production.food ? building.production.food * 1.2 : undefined,
            },
          };
        }
        return building;
      });

      return {
        ...prev,
        player: {
          ...prev.player,
          buildings: newBuildings,
        },
      };
    });
    updateProduction();
    addToast({
      message: 'Building upgraded successfully!',
      type: 'success',
    });
  }, [updateProduction, addToast]);

  // Add military unit
  const addMilitaryUnit = useCallback((unit: MilitaryUnit) => {
    setGameState(prev => {
      const newUnits = [...prev.player.militaryUnits, unit];
      return {
        ...prev,
        player: {
          ...prev.player,
          militaryUnits: newUnits,
        },
      };
    });
    addToast({
      message: `${unit.name} trained successfully!`,
      type: 'success',
    });
  }, [addToast]);

  // Add policy
  const addPolicy = useCallback((policy: Policy) => {
    setGameState(prev => {
      const newPolicies = [...prev.player.policies, policy];
      return {
        ...prev,
        player: {
          ...prev.player,
          policies: newPolicies,
          happiness: prev.player.happiness + policy.effects.happiness,
          productionBonus: prev.player.productionBonus + policy.effects.production,
          militaryBonus: prev.player.militaryBonus + policy.effects.military,
        },
      };
    });
    addToast({
      message: `${policy.name} implemented successfully!`,
      type: 'success',
    });
  }, [addToast]);

  // Update player stats
  const updatePlayerStats = useCallback((stats: Partial<Player>) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        ...stats,
      },
    }));
  }, []);

  // Set battle state
  const setBattleState = useCallback((isInBattle: boolean) => {
    setGameState(prev => ({
      ...prev,
      isInBattle,
    }));
  }, []);

  // Set location
  const setLocation = useCallback((location: string) => {
    setGameState(prev => ({
      ...prev,
      currentLocation: location,
    }));
  }, []);

  // Auto-update resources every minute
  useEffect(() => {
    const interval = setInterval(updateResources, 60000);
    return () => clearInterval(interval);
  }, [updateResources]);

  return {
    gameState,
    updateResources,
    updateProduction,
    addBuilding,
    upgradeBuilding,
    addMilitaryUnit,
    addPolicy,
    updatePlayerStats,
    setBattleState,
    setLocation,
  };
}; 