/**
 * @file useUIStore.js
 * @description Global UI state for Profynus.
 * Handles: sidebar, modals, toasts/notifications, global loading overlay.
 * No persistence needed — resets on page load.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useUIStore = create(
  devtools(
    (set, get) => ({
      // ─── Sidebar ────────────────────────────────────────────────────────────
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebar: (open) => set({ sidebarOpen: open }),

      // ─── Global Loading Overlay ─────────────────────────────────────────────
      globalLoading: false,
      setGlobalLoading: (value) => set({ globalLoading: value }),

      // ─── Modal System ───────────────────────────────────────────────────────
      // Usage: openModal('confirmDelete', { itemId: 42 })
      activeModal: null,       // modal name/key
      modalPayload: null,      // any data the modal needs

      openModal: (modalName, payload = null) =>
        set({ activeModal: modalName, modalPayload: payload }),

      closeModal: () => set({ activeModal: null, modalPayload: null }),

      // ─── Toast / Notification System ────────────────────────────────────────
      toasts: [],

      /**
       * @param {{ message: string, type?: 'success'|'error'|'info'|'warning', duration?: number }} toast
       */
      addToast: (toast) => {
        const id = Date.now().toString();
        const newToast = { id, type: 'info', duration: 4000, ...toast };

        set((state) => ({ toasts: [...state.toasts, newToast] }));

        // Auto-remove after duration
        setTimeout(() => {
          get().removeToast(id);
        }, newToast.duration);

        return id;
      },

      removeToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

      clearToasts: () => set({ toasts: [] }),

      // ─── Convenience toast shortcuts ────────────────────────────────────────
      toast: {
        success: (message, opts) =>
          useUIStore.getState().addToast({ message, type: 'success', ...opts }),
        error: (message, opts) =>
          useUIStore.getState().addToast({ message, type: 'error', duration: 6000, ...opts }),
        info: (message, opts) =>
          useUIStore.getState().addToast({ message, type: 'info', ...opts }),
        warning: (message, opts) =>
          useUIStore.getState().addToast({ message, type: 'warning', ...opts }),
      },
    }),
    { name: 'UIStore' }
  )
);

export default useUIStore;