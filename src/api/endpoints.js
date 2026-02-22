/**
 * @file endpoints.js
 * @description Centralized API endpoint registry for Profynus.
 * All routes are organized by domain/module.
 * Base URL is injected from environment variables via axiosInstance.
 */

const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  user: {
    me: '/users/me',
    updateProfile: '/users/me',
    changePassword: '/users/me/password',
    avatar: '/users/me/avatar',
    byId: (id) => `/users/${id}`,
  },

  // Example: future modules
  // projects: {
  //   list: '/projects',
  //   create: '/projects',
  //   byId: (id) => `/projects/${id}`,
  //   update: (id) => `/projects/${id}`,
  //   delete: (id) => `/projects/${id}`,
  // },
};

export default ENDPOINTS;