import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const recipeService = {
  /**
   * Envía datos de receta rápida (texto, imagen, audio) al backend MCP
   */
  async generateQuickRecipe(quickData) {
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

    return await apiClient.post(ENDPOINTS.MCP, payload);
  },

  async getUserRecipes() {
    return await apiClient.get(ENDPOINTS.RECIPES);
  },

  async getRecipeById(recipeId) {
    return await apiClient.get(`${ENDPOINTS.RECIPES}/${recipeId}`);
  },

  async deleteRecipe(recipeId) {
    return await apiClient.delete(`${ENDPOINTS.RECIPES}/${recipeId}`);
  }
};
