/**
 * @file index.js
 * @description Central export for all Profynus stores.
 * Import stores from here, not from individual files.
 *
 * @example
 * import { useAuthStore, useUIStore } from '@/store';
 */

export { default as useAuthStore } from './useAuthStore';
export { default as useUIStore }   from './useUIStore';
export { default as useUserStore } from './useUserStore';