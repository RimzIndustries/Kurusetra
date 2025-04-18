import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export function useOfflineSupport() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const syncGameState = useGameStore((state) => state.syncGameState);

  const handleOnline = useCallback(() => {
    setIsOffline(false);
    // Sync game state when coming back online
    syncGameState();
  }, [syncGameState]);

  const handleOffline = useCallback(() => {
    setIsOffline(true);
  }, []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  const registerSync = useCallback(async () => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.registration;
      try {
        await registration.sync.register('sync-game-state');
      } catch (error) {
        console.error('Failed to register sync:', error);
      }
    }
  }, []);

  return {
    isOffline,
    registerSync
  };
} 