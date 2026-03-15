/**
 * @file useAuthStore.js
 * @description Global authentication state for Profynus.
 * Uses: persist (localStorage), devtools (Redux DevTools support)
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import authService from '@/api/services/authService';

const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ─── State ──────────────────────────────────────────────────────────────
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // ─── Actions ────────────────────────────────────────────────────────────

        /**
         * Login user and persist session
         * @param {{ email: string, password: string }} credentials
         */
        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            const data = await authService.login(credentials);
            localStorage.setItem('access_token', data.accessToken);
            // localStorage.setItem('refresh_token', data.refreshToken); Will be stored in cookies

            set({
              user: data.user,
              accessToken: data.accessToken,
              isAuthenticated: true,
              isLoading: false,
            });

            return { success: true };
          } catch (err) {
            set({ error: err.message, isLoading: false });
            return { success: false, error: err.message };
          }
        },

        /**
         * Register new user
         * @param {{ name: string, email: string, password: string }} userData
         */
        register: async (userData) => {
          set({ isLoading: true, error: null });
          try {
            const data = await authService.register(userData);
            localStorage.setItem('access_token', data.accessToken);
            localStorage.setItem('refresh_token', data.refreshToken);

            set({
              user: data.user,
              accessToken: data.accessToken,
              isAuthenticated: true,
              isLoading: false,
            });

            return { success: true };
          } catch (err) {
            set({ error: err.message, isLoading: false });
            return { success: false, error: err.message };
          }
        },

        /**
         * Logout and clear all session data
         */
        logout: async () => {
          try {
            await authService.logout();
          } catch (error) {
            // Always logout client-side even if API fails
            console.log(error)
          } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              error: null,
            });
          }
        },

        /**
         * Update user data in store (e.g. after profile update)
         * @param {Partial<User>} updatedFields
         */
        setUser: (updatedFields) =>
          set((state) => ({ user: { ...state.user, ...updatedFields } })),

        clearError: () => set({ error: null }),
      }),

      {
        name: 'profynus-auth',           // localStorage key
        partialize: (state) => ({        // Only persist what you need
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }               // DevTools label
  )
);

export default useAuthStore;