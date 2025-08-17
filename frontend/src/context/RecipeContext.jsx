import React, { createContext, useContext, useState, useCallback } from 'react';
import { recipeService } from '../services/recipe.js';

const RecipeContext = createContext();

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Cargar todas las recetas del usuario
  const loadUserRecipes = useCallback(async (forceReload = false) => {
    if (!forceReload && hasLoaded) {
      return; // Ya tenemos los datos cacheados
    }

    setLoading(true);
    setError(null);
    
    try {
      const recipesData = await recipeService.getUserRecipes();
      console.log('Datos recibidos del backend:', recipesData);
      console.log('Primera receta ingredients:', recipesData[0]?.ingredients);
      setRecipes(Array.isArray(recipesData) ? recipesData : []);
      setHasLoaded(true);
    } catch (err) {
      console.error('Error cargando recetas del usuario:', err);
      setError(err.message || 'Error al cargar las recetas');
    } finally {
      setLoading(false);
    }
  }, [hasLoaded]);

  // Eliminar una receta
  const deleteRecipe = async (recipeId) => {
    try {
      await recipeService.deleteRecipe(recipeId);
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
      return true;
    } catch (err) {
      console.error('Error eliminando receta:', err);
      setError(err.message || 'Error al eliminar la receta');
      return false;
    }
  };

  // Agregar una nueva receta
  const addRecipe = (newRecipe) => {
    setRecipes(prevRecipes => [newRecipe, ...prevRecipes]);
  };

  // Limpiar datos al cerrar sesión
  const clearRecipeData = () => {
    setRecipes([]);
    setError(null);
    setHasLoaded(false);
  };

  const value = {
    recipes,
    loading,
    error,
    loadUserRecipes,
    deleteRecipe,
    addRecipe,
    clearRecipeData
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes debe usarse dentro de un RecipeProvider');
  }
  return context;
}
