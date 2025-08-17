import { apiService } from './api.js';

/**
 * Servicio para manejar operaciones relacionadas con listas de compras
 */
export const shoppingListService = {
  /**
   * Obtiene todas las listas de compras del usuario
   * @returns {Promise<Array>} Lista de listas de compras del usuario
   */
  async getUserShoppingLists() {
    try {
      return await apiService.get('/shopping-lists');
    } catch (error) {
      console.error('Error al obtener listas de compras del usuario:', error);
      throw error;
    }
  },

  /**
   * Obtiene una lista de compras específica por ID
   * @param {number} shoppingListId - ID de la lista de compras
   * @returns {Promise<Object>} Datos de la lista de compras
   */
  async getShoppingListById(shoppingListId) {
    try {
      return await apiService.get(`/shopping-lists/${shoppingListId}`);
    } catch (error) {
      console.error('Error al obtener lista de compras:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva lista de compras
   * @param {Object} shoppingListData - Datos de la lista de compras
   * @param {number} shoppingListData.menu_id - ID del menú asociado (opcional)
   * @param {Array} shoppingListData.items - Lista de elementos a comprar
   * @returns {Promise<Object>} Lista de compras creada
   */
  async createShoppingList(shoppingListData) {
    try {
      const validatedShoppingList = {
        menu_id: shoppingListData.menu_id || null,
        items: shoppingListData.items || []
      };

      return await apiService.post('/shopping-lists', validatedShoppingList);
    } catch (error) {
      console.error('Error al crear lista de compras:', error);
      throw error;
    }
  },

  /**
   * Actualiza una lista de compras existente
   * @param {number} shoppingListId - ID de la lista de compras
   * @param {Object} shoppingListData - Datos actualizados de la lista
   * @returns {Promise<Object>} Lista de compras actualizada
   */
  async updateShoppingList(shoppingListId, shoppingListData) {
    try {
      return await apiService.put(`/shopping-lists/${shoppingListId}`, shoppingListData);
    } catch (error) {
      console.error('Error al actualizar lista de compras:', error);
      throw error;
    }
  },

  /**
   * Elimina una lista de compras
   * @param {number} shoppingListId - ID de la lista de compras
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async deleteShoppingList(shoppingListId) {
    try {
      return await apiService.delete(`/shopping-lists/${shoppingListId}`);
    } catch (error) {
      console.error('Error al eliminar lista de compras:', error);
      throw error;
    }
  },

  /**
   * Añade un elemento a una lista de compras
   * @param {number} shoppingListId - ID de la lista de compras
   * @param {Object} item - Elemento a añadir
   * @param {string} item.name - Nombre del elemento
   * @param {string} item.quantity - Cantidad
   * @param {string} item.unit - Unidad de medida
   * @param {boolean} item.checked - Si está marcado como comprado
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async addItemToShoppingList(shoppingListId, item) {
    try {
      const validatedItem = {
        name: item.name,
        quantity: item.quantity || '',
        unit: item.unit || '',
        checked: item.checked || false
      };

      return await apiService.post(`/shopping-lists/${shoppingListId}/items`, validatedItem);
    } catch (error) {
      console.error('Error al añadir elemento a la lista de compras:', error);
      throw error;
    }
  },

  /**
   * Actualiza un elemento de una lista de compras
   * @param {number} shoppingListId - ID de la lista de compras
   * @param {number} itemIndex - Índice del elemento en la lista
   * @param {Object} itemData - Datos actualizados del elemento
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async updateShoppingListItem(shoppingListId, itemIndex, itemData) {
    try {
      return await apiService.put(`/shopping-lists/${shoppingListId}/items/${itemIndex}`, itemData);
    } catch (error) {
      console.error('Error al actualizar elemento de la lista de compras:', error);
      throw error;
    }
  },

  /**
   * Elimina un elemento de una lista de compras
   * @param {number} shoppingListId - ID de la lista de compras
   * @param {number} itemIndex - Índice del elemento a eliminar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async removeItemFromShoppingList(shoppingListId, itemIndex) {
    try {
      return await apiService.delete(`/shopping-lists/${shoppingListId}/items/${itemIndex}`);
    } catch (error) {
      console.error('Error al eliminar elemento de la lista de compras:', error);
      throw error;
    }
  },

  /**
   * Marca/desmarca un elemento como comprado
   * @param {number} shoppingListId - ID de la lista de compras
   * @param {number} itemIndex - Índice del elemento
   * @param {boolean} checked - Estado de marcado
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async toggleItemChecked(shoppingListId, itemIndex, checked) {
    try {
      return await apiService.put(`/shopping-lists/${shoppingListId}/items/${itemIndex}/check`, { checked });
    } catch (error) {
      console.error('Error al marcar elemento de la lista de compras:', error);
      throw error;
    }
  },

  /**
   * Genera una lista de compras a partir de un menú
   * @param {number} menuId - ID del menú
   * @param {Object} options - Opciones para generar la lista
   * @param {number} options.servings - Número de porciones
   * @param {Array} options.exclude_ingredients - Ingredientes a excluir
   * @returns {Promise<Object>} Lista de compras generada
   */
  async generateFromMenu(menuId, options = {}) {
    try {
      return await apiService.post('/shopping-lists/generate', { menu_id: menuId, ...options });
    } catch (error) {
      console.error('Error al generar lista de compras desde menú:', error);
      throw error;
    }
  }
};
