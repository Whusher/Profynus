/**
 * @file useUserStore.js
 * @description User profile state management for Profynus.
 * Handles fetching, updating profile, and avatar upload.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import userService from '@/api/services/userService';
import useAuthStore from '../auth/AuthStore';

const useUserStore = create(
  devtools(
    (set) => ({
      // ─── State ──────────────────────────────────────────────────────────────
      profile: null,
      isLoading: false,
      isUpdating: false,
      error: null,

      // ─── Actions ────────────────────────────────────────────────────────────

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const profile = await userService.getMe();
          set({ profile, isLoading: false });
          return profile;
        } catch (err) {
          set({ error: err.message, isLoading: false });
        }
      },

      /**
       * @param {{ name?: string, bio?: string, [key: string]: any }} data
       */
      updateProfile: async (data) => {
        set({ isUpdating: true, error: null });
        try {
          const updated = await userService.updateProfile(data);

          set({ profile: updated, isUpdating: false });

          // Sync name/avatar back into the auth store user object
          useAuthStore.getState().setUser({ name: updated.name, avatar: updated.avatar });

          return { success: true };
        } catch (err) {
          set({ error: err.message, isUpdating: false });
          return { success: false, error: err.message };
        }
      },

      /**
       * @param {File} file
       */
      uploadAvatar: async (file) => {
        set({ isUpdating: true, error: null });
        try {
          const updated = await userService.uploadAvatar(file);
          set((state) => ({
            profile: { ...state.profile, avatar: updated.avatar },
            isUpdating: false,
          }));
          useAuthStore.getState().setUser({ avatar: updated.avatar });
          return { success: true };
        } catch (err) {
          set({ error: err.message, isUpdating: false });
          return { success: false, error: err.message };
        }
      },

      resetProfile: () => set({ profile: null, error: null }),
    }),
    { name: 'UserStore' }
  )
);

export default useUserStore;