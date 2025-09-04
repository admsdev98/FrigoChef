import { apiService } from './api.js';

/**
 * Servicio para manejar operaciones relacionadas con recetas
 */
export const recipeService = {
  /**
   * Envía datos de receta rápida (texto, imagen, audio) al backend MCP
   * @param {Object} quickData - { mode, text, image, audio }
   * @returns {Promise<Object>} Receta generada
   */
  async generateQuickRecipe(quickData) {
    try {
      let tool = quickData.mode;
      let content = '';
      if (tool === 'text') {
        content = quickData.text;
      } else if (tool === 'image' && quickData.image && quickData.image.file) {
        content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(quickData.image.file);
        });
      } else if (tool === 'audio' && quickData.audio && quickData.audio.blob) {
        content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(quickData.audio.blob);
        });
      }

      const payload = {
        type: 'quick-recipe',
        tool,
        content
      };

      // Autenticación manual
      const { data: { session }, error: sessionError } = await import('./supabase.js').then(m => m.supabase.auth.getSession());
      if (sessionError || !session) throw new Error('Usuario no autenticado');

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const url = `${API_BASE_URL}/mcp`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error al generar receta rápida:', error);
      throw error;
    }
  },
  /**
   * Obtiene todas las recetas del usuario
   * @returns {Promise<Array>} Lista de recetas del usuario
   */
  async getUserRecipes() {
    try {
      return await apiService.get('/recipes');
    } catch (error) {
      console.error('Error al obtener recetas del usuario:', error);
      throw error;
    }
  },

  /**
   * Obtiene una receta específica por ID
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Object>} Datos de la receta
   */
  async getRecipeById(recipeId) {
    try {
      return await apiService.get(`/recipes/${recipeId}`);
    } catch (error) {
      console.error('Error al obtener receta:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva receta
   * @param {Object} recipeData - Datos de la receta
   * @param {string} recipeData.title - Título de la receta
   * @param {Object} recipeData.recipe_metadata - Metadatos de la receta (instrucciones, tiempo, etc.)
   * @param {Array} recipeData.ingredients - Lista de ingredientes con cantidad y unidad
   * @param {string} recipeData.source_type - Tipo de fuente (manual, ai, imported, etc.)
   * @param {string} recipeData.source_data - Datos adicionales de la fuente
   * @returns {Promise<Object>} Receta creada
   */
  async createRecipe(recipeData) {
    try {
      const validatedRecipe = {
        title: recipeData.title,
        recipe_metadata: recipeData.recipe_metadata || {},
        ingredients: recipeData.ingredients || [],
        source_type: recipeData.source_type || 'manual',
        source_data: recipeData.source_data || ''
      };

      return await apiService.post('/recipes', validatedRecipe);
    } catch (error) {
      console.error('Error al crear receta:', error);
      throw error;
    }
  },

  /**
   * Actualiza una receta existente
   * @param {number} recipeId - ID de la receta
   * @param {Object} recipeData - Datos actualizados de la receta
   * @returns {Promise<Object>} Receta actualizada
   */
  async updateRecipe(recipeId, recipeData) {
    try {
      return await apiService.put(`/recipes/${recipeId}`, recipeData);
    } catch (error) {
      console.error('Error al actualizar receta:', error);
      throw error;
    }
  },

  /**
   * Elimina una receta
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async deleteRecipe(recipeId) {
    try {
      return await apiService.delete(`/recipes/${recipeId}`);
    } catch (error) {
      console.error('Error al eliminar receta:', error);
      throw error;
    }
  },

  /**
   * Genera una receta con IA basada en ingredientes
   * @param {Array} ingredients - Lista de ingredientes disponibles
   * @param {Object} preferences - Preferencias del usuario (opcional)
   * @returns {Promise<Object>} Receta generada
   */
  async generateRecipeFromIngredients(ingredients, preferences = {}) {
    try {
      const requestData = {
        ingredients,
        preferences
      };

      return await apiService.post('/recipes/generate', requestData);
    } catch (error) {
      console.error('Error al generar receta:', error);
      throw error;
    }
  },

  /**
   * Busca recetas por criterios
   * @param {Object} searchCriteria - Criterios de búsqueda
   * @param {string} searchCriteria.query - Texto de búsqueda
   * @param {Array} searchCriteria.ingredients - Ingredientes a incluir
   * @param {Array} searchCriteria.exclude_ingredients - Ingredientes a excluir
   * @param {string} searchCriteria.diet_type - Tipo de dieta
   * @returns {Promise<Array>} Lista de recetas que coinciden
   */
  async searchRecipes(searchCriteria) {
    try {
      return await apiService.post('/recipes/search', searchCriteria);
    } catch (error) {
      console.error('Error al buscar recetas:', error);
      throw error;
    }
  }
};
