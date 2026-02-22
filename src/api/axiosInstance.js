/**
 * @file axiosInstance.js
 * @description Global Axios instance for Profynus.
 * Handles: base config, auth headers, token refresh, error normalization.
 */

import axios from 'axios';

// ─── Config from Environment ──────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

if (!BASE_URL) {
  throw new Error('[Profynus] VITE_API_BASE_URL is not defined. Check your .env file.');
}

// ─── Instance ─────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Attach Bearer token from localStorage (or a token store)
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Optional: log requests in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  // Success: return only data payload
  (response) => response.data,

  // Error: normalize and handle globally
  async (error) => {
    const originalRequest = error.config;

    // --- Token Refresh Logic (401) ---
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });

        localStorage.setItem('access_token', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        // Refresh failed → force logout
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // --- Normalized Error Object ---
    const normalizedError = {
      status: error.response?.status ?? 0,
      message: error.response?.data?.message ?? error.message ?? 'Unexpected error',
      data: error.response?.data ?? null,
      originalError: error,
    };

    if (import.meta.env.DEV) {
      console.error('[API Error]', normalizedError);
    }

    return Promise.reject(normalizedError);
  }
);

export default api;