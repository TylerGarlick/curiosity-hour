// AsyncStorage persistence layer for Zustand stores
import { useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Debounce helper
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Storage keys
const STORAGE_KEYS = {
  GAMES: '@curiosity_hour_games',
  SETTINGS: '@curiosity_hour_settings',
  PURCHASES: '@curiosity_hour_purchases',
} as const;

// Generic persist function for any store slice
export function persistStore<T extends object>(
  key: string,
  state: T,
  onStoreChange?: (state: T) => void
): void {
  const debouncedSave = debounce(async (data: T) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`[useStorage] Failed to save ${key}:`, error);
    }
  }, 300);

  if (onStoreChange) {
    // Watch for changes and persist
    debouncedSave(state);
  }
}

// Hydrate a store from AsyncStorage
export async function hydrateStore<T>(key: string): Promise<T | null> {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  } catch (error) {
    console.error(`[useStorage] Failed to hydrate ${key}:`, error);
    return null;
  }
}

// Hook to persist and hydrate any Zustand store
export function useStorage<T extends object>(
  key: string,
  initialState: T,
  onRestore?: (state: T) => void
): [T, (updater: T | ((prev: T) => T)) => void, boolean] {
  const isHydrated = useRef(false);
  const stateRef = useRef<T>(initialState);

  // Hydrate on mount
  useEffect(() => {
    const restore = async () => {
      const stored = await hydrateStore<T>(key);
      if (stored) {
        stateRef.current = stored;
        onRestore?.(stored);
      }
      isHydrated.current = true;
    };
    restore();
  }, [key]);

  // Setter with debounced persistence
  const setState = useCallback(
    (updater: T | ((prev: T) => T)) => {
      const newState =
        typeof updater === 'function'
          ? (updater as (prev: T) => T)(stateRef.current)
          : updater;

      stateRef.current = newState;

      // Debounced save to AsyncStorage
      debounce(async () => {
        try {
          await AsyncStorage.setItem(key, JSON.stringify(newState));
        } catch (error) {
          console.error(`[useStorage] Failed to save ${key}:`, error);
        }
      }, 300)();
    },
    [key]
  );

  return [stateRef.current, setState, isHydrated.current];
}

// Clear all app storage
export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('[useStorage] Failed to clear storage:', error);
  }
}

// Export storage keys for direct use
export { STORAGE_KEYS };
