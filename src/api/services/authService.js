/**
 * @file authService.js
 * @description Authentication API calls for Profynus.
 */

import api from '../axiosInstance';
import ENDPOINTS from '../endpoints';

const authService = {
  /**
   * @param {{ email: string, password: string }} credentials
   */
  login: (credentials) => api.post(ENDPOINTS.auth.login, credentials),

  /**
   * @param {{ name: string, email: string, password: string }} userData
   */
  register: (userData) => api.post(ENDPOINTS.auth.register, userData),

  logout: () => api.post(ENDPOINTS.auth.logout),

  forgotPassword: (email) => api.post(ENDPOINTS.auth.forgotPassword, { email }),

  /**
   * @param {{ token: string, newPassword: string }} payload
   */
  resetPassword: (payload) => api.post(ENDPOINTS.auth.resetPassword, payload),
};

export default authService;