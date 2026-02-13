import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Auth state
      user: null,
      token: null,
      isAuthenticated: false,

      // Users to swipe
      swipeableUsers: [],
      currentIndex: 0,

      // Matches
      matches: [],

      // Loading states
      isLoading: false,

      // Actions
      setUser: (user, token) => set({
        user,
        token,
        isAuthenticated: !!token
      }),

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        swipeableUsers: [],
        currentIndex: 0,
        matches: []
      }),

      setSwipeableUsers: (users) => set({
        swipeableUsers: users,
        currentIndex: 0
      }),

      nextUser: () => set((state) => ({
        currentIndex: state.currentIndex + 1
      })),

      prevUser: () => set((state) => ({
        currentIndex: Math.max(0, state.currentIndex - 1)
      })),

      getCurrentUser: () => {
        const state = get();
        return state.swipeableUsers[state.currentIndex] || null;
      },

      hasMoreUsers: () => {
        const state = get();
        return state.currentIndex < state.swipeableUsers.length;
      },

      setMatches: (matches) => set({ matches }),

      addMatch: (matchedUser) => set((state) => ({
        matches: [...state.matches, matchedUser]
      })),

      setLoading: (isLoading) => set({ isLoading })
    }),
    {
      name: 'company-crush-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useStore;
