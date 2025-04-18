import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { gameCache } from '../utils/gameCache';
import { fetchWithRetry, trackError } from '../utils/apiUtils';

interface GameState {
  resources: {
    gold: number;
    wood: number;
    stone: number;
    food: number;
  };
  buildings: {
    [key: string]: {
      level: number;
      health: number;
    };
  };
  units: {
    [key: string]: number;
  };
  isLoading: boolean;
  error: Error | null;
  lastUpdated: number;
}

interface GameActions {
  updateResources: (resources: Partial<GameState['resources']>) => void;
  updateBuilding: (buildingId: string, updates: Partial<GameState['buildings'][string]>) => void;
  updateUnits: (unitType: string, count: number) => void;
  syncGameState: () => Promise<void>;
  resetError: () => void;
}

const initialState: GameState = {
  resources: {
    gold: 0,
    wood: 0,
    stone: 0,
    food: 0
  },
  buildings: {},
  units: {},
  isLoading: false,
  error: null,
  lastUpdated: Date.now()
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateResources: (resources) => {
        set((state) => ({
          resources: { ...state.resources, ...resources }
        }));
      },

      updateBuilding: (buildingId, updates) => {
        set((state) => ({
          buildings: {
            ...state.buildings,
            [buildingId]: {
              ...state.buildings[buildingId],
              ...updates
            }
          }
        }));
      },

      updateUnits: (unitType, count) => {
        set((state) => ({
          units: {
            ...state.units,
            [unitType]: count
          }
        }));
      },

      syncGameState: async () => {
        try {
          set({ isLoading: true, error: null });

          // Optimistic update: use cached data if available
          const cachedState = gameCache.get<GameState>('game-state');
          if (cachedState) {
            set(cachedState);
          }

          // Fetch latest state from server
          const response = await fetchWithRetry<GameState>('/api/game-state');
          
          // Update cache and state
          gameCache.set('game-state', response);
          set({
            ...response,
            isLoading: false,
            lastUpdated: Date.now()
          });
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to sync game state');
          trackError(err, { action: 'syncGameState' });
          set({ error: err, isLoading: false });
        }
      },

      resetError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        resources: state.resources,
        buildings: state.buildings,
        units: state.units,
        lastUpdated: state.lastUpdated
      })
    }
  )
); 