/**
 * GLOBAL STATE MANAGEMENT
 * Zustand stores for auth, library, and app state
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signIn, signUp, signOut, getCurrentUser } from './lib.js';

// Authentication store
export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      set({ user: data.user });
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, userData = {}) => {
    set({ loading: true });
    try {
      const { data, error } = await signUp(email, password, userData);
      if (error) throw error;
      set({ user: data.user });
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await signOut();
      set({ user: null });
      useLibraryStore.getState().clearLibrary();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      set({ loading: false });
    }
  },

  isAdmin: () => {
    const { user } = get();
    return user?.user_metadata?.role === 'admin' || user?.email === 'admin@audioguide.com';
  },

  initializeAuth: async () => {
    try {
      const user = getCurrentUser();
      if (user) set({ user });
    } catch (error) {
      console.error('Auth init error:', error);
    } finally {
      set({ loading: false });
    }
  }
}));

// Library store for purchased guides
export const useLibraryStore = create(
  persist(
    (set, get) => ({
      purchasedGuides: [],

      addPurchasedGuide: (guide) => {
        const guides = get().purchasedGuides;
        if (!guides.find(g => g.id === guide.id)) {
          set({ purchasedGuides: [...guides, guide] });
        }
      },

      removePurchasedGuide: (guideId) => {
        set({ 
          purchasedGuides: get().purchasedGuides.filter(g => g.id !== guideId) 
        });
      },

      isPurchased: (guideId) => {
        return get().purchasedGuides.some(guide => 
          guide.id === guideId || guide.id === String(guideId)
        );
      },

      clearLibrary: () => set({ purchasedGuides: [] })
    }),
    { name: 'library' }
  )
);