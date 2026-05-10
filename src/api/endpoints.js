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
    me: '/user/me',
    updateProfile: '/user/me',
    changePassword: '/user/me/password',
    avatar: '/user/me/avatar',
    byId: (id) => `/user/${id}`,
    validateUserName: (us) =>  `/user/validateUsername/${encodeURI(us)}`
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