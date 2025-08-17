import { apiService } from './api.js';

/**
 * Servicio para manejar operaciones relacionadas con el usuario
 */
export const userService = {
  /**
   * Obtiene el perfil del usuario
   * @returns {Promise<Object>} Datos del perfil del usuario
   */
  async getProfile() {
    try {
      return await apiService.get('/user/profile');
    } catch (error) {
      console.error('Error al obtener perfil de usuario:', error);
      throw error;
    }
  },

  /**
   * Obtiene las preferencias nutricionales del usuario
   * @returns {Promise<Object>} Preferencias nutricionales del usuario
   */
  async getNutritionalPreferences() {
    try {
      return await apiService.get('/user/nutritional-preferences');
    } catch (error) {
      console.error('Error al obtener preferencias nutricionales:', error);
      throw error;
    }
  },

  /**
   * Guarda las preferencias nutricionales del usuario
   * @param {Object} preferences - Objeto con las preferencias nutricionales
   * @param {Array} preferences.allergens - Lista de alérgenos
   * @param {Array} preferences.diet_type - Tipos de dieta preferidos
   * @param {Array} preferences.preferred_foods - Alimentos preferidos
   * @param {Array} preferences.avoid_foods - Alimentos a evitar
   * @param {Array} preferences.favorite_dishes - Platos favoritos
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async setNutritionalPreferences(preferences) {
    try {
      // Validar estructura de datos
      const validatedPreferences = {
        allergens: preferences.allergens || [],
        diet_type: preferences.diet_type || [],
        preferred_foods: preferences.preferred_foods || [],
        avoid_foods: preferences.avoid_foods || [],
        favorite_dishes: preferences.favorite_dishes || []
      };

      return await apiService.post('/user/nutritional-preferences', validatedPreferences);
    } catch (error) {
      console.error('Error al guardar preferencias nutricionales:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las preferencias del usuario (para futuras extensiones)
   * @returns {Promise<Object>} Todas las preferencias del usuario
   */
  async getUserPreferences() {
    try {
      return await apiService.get('/user/preferences');
    } catch (error) {
      console.error('Error al obtener preferencias del usuario:', error);
      throw error;
    }
  },

  /**
   * Actualiza las preferencias generales del usuario
   * @param {Object} preferences - Objeto con las preferencias del usuario
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async updateUserPreferences(preferences) {
    try {
      return await apiService.put('/user/preferences', preferences);
    } catch (error) {
      console.error('Error al actualizar preferencias del usuario:', error);
      throw error;
    }
  },

  /**
   * Obtiene el perfil del usuario
   * @returns {Promise<Object>} Datos del perfil del usuario
   */
  async getUserProfile() {
    try {
      return await apiService.get('/user/profile');
    } catch (error) {
      console.error('Error al obtener perfil del usuario:', error);
      throw error;
    }
  },

  /**
   * Actualiza el perfil del usuario
   * @param {Object} profileData - Datos del perfil a actualizar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async updateUserProfile(profileData) {
    try {
      return await apiService.put('/user/profile', profileData);
    } catch (error) {
      console.error('Error al actualizar perfil del usuario:', error);
      throw error;
    }
  }
};
