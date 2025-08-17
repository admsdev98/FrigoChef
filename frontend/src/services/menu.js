import { apiService } from './api.js';

/**
 * Servicio para manejar operaciones relacionadas con menús
 */
export const menuService = {
  /**
   * Obtiene todos los menús del usuario
   * @returns {Promise<Array>} Lista de menús del usuario
   */
  async getUserMenus() {
    try {
      return await apiService.get('/menus');
    } catch (error) {
      console.error('Error al obtener menús del usuario:', error);
      throw error;
    }
  },

  /**
   * Obtiene un menú específico por ID
   * @param {number} menuId - ID del menú
   * @returns {Promise<Object>} Datos del menú con sus recetas
   */
  async getMenuById(menuId) {
    try {
      return await apiService.get(`/menus/${menuId}`);
    } catch (error) {
      console.error('Error al obtener menú:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo menú
   * @param {Object} menuData - Datos del menú
   * @param {string} menuData.title - Título del menú
   * @param {Object} menuData.menu_metadata - Metadatos del menú (descripción, duración, etc.)
   * @param {Array} menuData.recipe_ids - IDs de las recetas a incluir
   * @returns {Promise<Object>} Menú creado
   */
  async createMenu(menuData) {
    try {
      const validatedMenu = {
        title: menuData.title,
        menu_metadata: menuData.menu_metadata || {},
        recipe_ids: menuData.recipe_ids || []
      };

      return await apiService.post('/menus', validatedMenu);
    } catch (error) {
      console.error('Error al crear menú:', error);
      throw error;
    }
  },

  /**
   * Actualiza un menú existente
   * @param {number} menuId - ID del menú
   * @param {Object} menuData - Datos actualizados del menú
   * @returns {Promise<Object>} Menú actualizado
   */
  async updateMenu(menuId, menuData) {
    try {
      return await apiService.put(`/menus/${menuId}`, menuData);
    } catch (error) {
      console.error('Error al actualizar menú:', error);
      throw error;
    }
  },

  /**
   * Elimina un menú
   * @param {number} menuId - ID del menú
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async deleteMenu(menuId) {
    try {
      return await apiService.delete(`/menus/${menuId}`);
    } catch (error) {
      console.error('Error al eliminar menú:', error);
      throw error;
    }
  },

  /**
   * Añade una receta a un menú
   * @param {number} menuId - ID del menú
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async addRecipeToMenu(menuId, recipeId) {
    try {
      return await apiService.post(`/menus/${menuId}/recipes`, { recipe_id: recipeId });
    } catch (error) {
      console.error('Error al añadir receta al menú:', error);
      throw error;
    }
  },

  /**
   * Elimina una receta de un menú
   * @param {number} menuId - ID del menú
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async removeRecipeFromMenu(menuId, recipeId) {
    try {
      return await apiService.delete(`/menus/${menuId}/recipes/${recipeId}`);
    } catch (error) {
      console.error('Error al eliminar receta del menú:', error);
      throw error;
    }
  },

  /**
   * Genera una lista de compras basada en un menú
   * @param {number} menuId - ID del menú
   * @param {Object} options - Opciones para la lista de compras
   * @param {number} options.servings - Número de porciones (opcional)
   * @param {Array} options.exclude_ingredients - Ingredientes a excluir (opcional)
   * @returns {Promise<Object>} Lista de compras generada
   */
  async generateShoppingList(menuId, options = {}) {
    try {
      return await apiService.post(`/menus/${menuId}/shopping-list`, options);
    } catch (error) {
      console.error('Error al generar lista de compras:', error);
      throw error;
    }
  },

  /**
   * Genera un menú automáticamente basado en preferencias
   * @param {Object} criteria - Criterios para generar el menú
   * @param {number} criteria.days - Número de días para el menú
   * @param {number} criteria.meals_per_day - Comidas por día
   * @param {Array} criteria.dietary_restrictions - Restricciones dietéticas
   * @param {Array} criteria.preferred_cuisines - Cocinas preferidas
   * @returns {Promise<Object>} Menú generado
   */
  async generateMenu(criteria) {
    try {
      const validatedCriteria = {
        days: criteria.days || 7,
        meals_per_day: criteria.meals_per_day || 3,
        dietary_restrictions: criteria.dietary_restrictions || [],
        preferred_cuisines: criteria.preferred_cuisines || []
      };

      return await apiService.post('/menus/generate', validatedCriteria);
    } catch (error) {
      console.error('Error al generar menú:', error);
      throw error;
    }
  }
};
