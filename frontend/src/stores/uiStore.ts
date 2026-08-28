import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Train } from '../types';

type DrawerState = 'collapsed' | 'half' | 'full';

interface UIStore {
  selectedTrain: Train | null;
  setSelectedTrain: (train: Train | null) => void;
  drawerState: DrawerState;
  setDrawerState: (state: DrawerState) => void;
  followMode: boolean;
  setFollowMode: (enabled: boolean) => void;
  recentSearches: Train[];
  addRecentSearch: (train: Train) => void;
  removeRecentSearch: (trainId: string) => void;
  clearRecentSearches: () => void;
  favourites: Train[];
  addFavourite: (train: Train) => void;
  removeFavourite: (trainId: string) => void;
  isFavourite: (trainId: string) => boolean;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      selectedTrain: null,
      setSelectedTrain: (train) => set({ selectedTrain: train }),
      drawerState: 'half',
      setDrawerState: (state) => set({ drawerState: state }),
      followMode: true,
      setFollowMode: (enabled) => set({ followMode: enabled }),
      recentSearches: [],
      addRecentSearch: (train) => set((s) => ({
        recentSearches: [train, ...s.recentSearches.filter(t => t.id !== train.id)].slice(0, 10)
      })),
      removeRecentSearch: (trainId) => set((s) => ({
        recentSearches: s.recentSearches.filter(t => t.id !== trainId)
      })),
      clearRecentSearches: () => set({ recentSearches: [] }),
      favourites: [],
      addFavourite: (train) => set((s) => ({
        favourites: [train, ...s.favourites.filter(t => t.id !== train.id)]
      })),
      removeFavourite: (trainId) => set((s) => ({
        favourites: s.favourites.filter(t => t.id !== trainId)
      })),
      isFavourite: (trainId) => get().favourites.some(t => t.id === trainId),
    }),
    { name: 'railgaadi-ui', partialize: (s) => ({ recentSearches: s.recentSearches, favourites: s.favourites }) }
  )
);
