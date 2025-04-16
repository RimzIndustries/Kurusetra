import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  fetchGameState,
  saveGameState,
  setupGameStateSync,
  applyResourceProduction,
} from "../../utils/gameSync";
import { supabase } from "../../utils/supabaseClient";

type GameSyncManagerProps = {
  children: React.ReactNode;
};

// This component manages game state synchronization with Supabase
export default function GameSyncManager({ children }: GameSyncManagerProps) {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsInitialized(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const initializeGameSync = async () => {
      try {
        // Fetch initial game state
        const gameState = await fetchGameState(user.id);

        if (!gameState) {
          console.log("No existing game state found, user may be new");
          setIsInitialized(true);
          return;
        }

        // Apply resource production based on time elapsed since last update
        const updatedState = applyResourceProduction(gameState);

        // Save the updated state back to Supabase
        await saveGameState(updatedState);

        // Set up realtime sync
        const { unsubscribe: cleanup } = setupGameStateSync(
          user.id,
          (newState) => {
            console.log(
              "Game state updated via realtime:",
              newState.lastUpdated,
            );
          },
        );

        unsubscribe = cleanup;
        setIsInitialized(true);
        setSyncError(null);
      } catch (error) {
        console.error("Error initializing game sync:", error);
        setSyncError(
          "Failed to synchronize game data. Please refresh the page.",
        );
      }
    };

    // Call resource calculator edge function to get production rates
    const calculateResources = async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "resource_calculator",
          {
            body: { userId: user.id },
          },
        );

        if (error) {
          console.error("Error calculating resources:", error);
          return;
        }

        console.log("Resource production rates:", data.production);
      } catch (err) {
        console.error("Failed to call resource calculator:", err);
      }
    };

    initializeGameSync();
    calculateResources();

    // Set up periodic sync (every 5 minutes)
    const syncInterval = setInterval(
      () => {
        fetchGameState(user.id).then((gameState) => {
          if (gameState) {
            const updatedState = applyResourceProduction(gameState);
            saveGameState(updatedState);
          }
        });
      },
      5 * 60 * 1000,
    );

    return () => {
      clearInterval(syncInterval);
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  if (syncError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{syncError}</p>
        <button
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
