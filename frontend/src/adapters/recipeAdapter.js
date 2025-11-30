/**
 * Adapts backend recipe data to frontend format
 * @param {Object} backendRecipe 
 * @returns {Object} Frontend friendly recipe object
 */
export const adaptRecipe = (backendRecipe) => {
    if (!backendRecipe) return null;
    return {
        id: backendRecipe.id,
        title: backendRecipe.title,
        description: backendRecipe.description || '',
        ingredients: backendRecipe.ingredients || [], // Assuming backend returns list of strings or objects
        steps: backendRecipe.steps || [],
        cookingTime: backendRecipe.cooking_time || 0,
        servings: backendRecipe.servings || 1,
        calories: backendRecipe.calories,
        image: backendRecipe.image,
        metadata: backendRecipe.recipe_metadata,
        // Add any other fields needed for UI
    };
};

export const adaptRecipeList = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map(adaptRecipe);
};
