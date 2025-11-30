import React, { createContext, useContext, useState, useCallback } from 'react';
import { recipeService } from '../services/recipe.js';
import { adaptRecipeList } from '../adapters/recipeAdapter.js';

const RecipeContext = createContext();

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Cargar todas las recetas del usuario
  const loadUserRecipes = useCallback(async (forceReload = false) => {
    if (!forceReload && hasLoaded) {
      return; // Ya tenemos los datos cacheados
    }

    setLoading(true);
    setError(null);

    try {
      const recipesData = await recipeService.getUserRecipes();
      const adaptedRecipes = adaptRecipeList(recipesData);
      setRecipes(adaptedRecipes);
      setHasLoaded(true);
    } catch (err) {
      console.error('Error cargando recetas del usuario:', err);
      setError(err.message || 'Error al cargar las recetas');
    } finally {
      setLoading(false);
    }
  }, [hasLoaded]);

  // Generar receta rápida con progreso simulado
  const generateQuickRecipe = async (data) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);

    // Simular progreso inicial
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      const result = await recipeService.generateQuickRecipe(data);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Esperar un poco para que el usuario vea el 100%
      await new Promise(resolve => setTimeout(resolve, 500));

      // Recargar recetas para incluir la nueva
      await loadUserRecipes(true);

      return result;
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Error generando receta:', err);
      setError(err.message || 'Error al generar la receta');
      throw err;
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

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
    setIsGenerating(false);
    setGenerationProgress(0);
  };

  const value = {
    recipes,
    loading,
    error,
    isGenerating,
    generationProgress,
    loadUserRecipes,
    generateQuickRecipe,
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
