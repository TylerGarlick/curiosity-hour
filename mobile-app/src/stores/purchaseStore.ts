// Purchase State Management with Zustand
import { create } from 'zustand';

interface PurchaseStore {
  ownedPackIds: string[];
  // actions
  addPack: (packId: string) => void;
  isOwned: (packId: string) => boolean;
  restorePacks: (packIds: string[]) => void;
}

export const usePurchaseStore = create<PurchaseStore>((set, get) => ({
  ownedPackIds: [],

  addPack: (packId) => {
    set(state => {
      if (state.ownedPackIds.includes(packId)) {
        return state;
      }
      return {
        ownedPackIds: [...state.ownedPackIds, packId],
      };
    });
  },

  isOwned: (packId) => {
    return get().ownedPackIds.includes(packId);
  },

  restorePacks: (packIds) => {
    set({ ownedPackIds: packIds });
  },
}));

export default usePurchaseStore;
