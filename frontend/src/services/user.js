import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const userService = {
  /**
   * Obtiene las preferencias nutricionales del usuario
   */
  async getNutritionalPreferences() {
    return await apiClient.get(ENDPOINTS.USER_PREFERENCES);
  },

  /**
   * Guarda las preferencias nutricionales del usuario
   */
  async setNutritionalPreferences(preferences) {
    return await apiClient.post(ENDPOINTS.USER_PREFERENCES, preferences);
  },

  /**
   * Obtiene el perfil del usuario (username, full_name, etc)
   */
  async getUserProfile() {
    return await apiClient.get(ENDPOINTS.USER_PROFILE);
  },

  /**
   * Actualiza el perfil del usuario
   */
  async updateUserProfile(profileData) {
    return await apiClient.put(ENDPOINTS.USER_PROFILE, profileData);
  }
};
