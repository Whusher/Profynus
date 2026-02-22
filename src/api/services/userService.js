/**
 * @file userService.js
 * @description User profile API calls for Profynus.
 */

import api from '../axiosInstance';
import ENDPOINTS from '../endpoints';

const userService = {
  getMe: () => api.get(ENDPOINTS.user.me),

  updateProfile: (data) => api.patch(ENDPOINTS.user.updateProfile, data),

  changePassword: (data) => api.put(ENDPOINTS.user.changePassword, data),

  /**
   * Upload avatar using FormData (multipart)
   * @param {File} file
   */
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post(ENDPOINTS.user.avatar, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getUserById: (id) => api.get(ENDPOINTS.user.byId(id)),
};

export default userService;