/**
 * @file index.js
 * @description Central export for all Profynus stores.
 * Import stores from here, not from individual files.
 *
 * @example
 * import { useAuthStore, useUIStore } from '@/store';
 */

export { default as useAuthStore } from './auth/AuthStore';
export { default as useUIStore }   from './ui/UIStore';
export { default as useThemeStore } from './theme/ThemeStore';
export { default as useSettingsStore } from './settings/SettingsStore';
export { default as useUserStore } from './user/UserStore';
export { default as usePlayerStore } from './player/PlayerStore';