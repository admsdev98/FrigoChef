import React, { useEffect } from 'react';
import { useRecipes } from '../context/RecipeContext.jsx';
import RecipeCard from './RecipeCard.jsx';
import { SkeletonLoaders } from './SkeletonLoaders.jsx';

const RecipeList = ({ onCreateNew }) => {
  const { recipes, loading, error, loadUserRecipes, deleteRecipe } = useRecipes();

  useEffect(() => {
    loadUserRecipes(true); // Forzar carga inicial
  }, [loadUserRecipes]);

  const handleDeleteRecipe = async (recipeId) => {
    return await deleteRecipe(recipeId);
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoaders.RecipeCard />
          <SkeletonLoaders.RecipeCard />
          <SkeletonLoaders.RecipeCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar recetas</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadUserRecipes(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No tienes recetas guardadas</h3>
        <p className="text-slate-600 mb-6">
          Comienza creando tu primera receta con los ingredientes que tengas disponibles.
        </p>
        <button
          onClick={onCreateNew}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Crear mi primera receta
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Mis recetas ({recipes.length})
        </h2>
        <button
          onClick={onCreateNew}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Nueva receta
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            ingredients={recipe.ingredients}
            instructions={recipe.recipe_metadata?.instructions}
            metadata={recipe.recipe_metadata}
            onDelete={handleDeleteRecipe}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
