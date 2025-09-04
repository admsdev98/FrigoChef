import React, { useEffect, useState } from 'react';
import { useRecipes } from '../context/RecipeContext.jsx';
import RecipeCard from './RecipeCard.jsx';
import { SkeletonLoaders } from './SkeletonLoaders.jsx';

const RecipeList = ({ onCreateNew }) => {
  const { recipes, loading, error, loadUserRecipes, deleteRecipe } = useRecipes();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'ingredients'
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Responsive items per page
  const getItemsPerPage = () => {
    if (typeof window === 'undefined') return 6;
    const width = window.innerWidth;
    if (width >= 1280) return 6; // xl: desktop - 2 filas × 3 columnas  
    if (width >= 768) return 4;  // md: tablet - 2 filas × 2 columnas
    return 3; // mobile: 3 items por página
  };
  
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
      setCurrentPage(1); // Reset to first page on resize
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadUserRecipes(true); // Forzar carga inicial
  }, [loadUserRecipes]);

  const handleDeleteRecipe = async (recipeId) => {
    return await deleteRecipe(recipeId);
  };

  // Filtrar y ordenar recetas
  const filteredAndSortedRecipes = React.useMemo(() => {
    // Debug: Ver estructura de datos
    if (recipes.length > 0 && searchTerm) {
      console.log('Debug - Primera receta:', recipes[0]);
      console.log('Debug - Ingredientes de primera receta:', recipes[0]?.ingredients);
    }

    let filtered = recipes.filter(recipe => {
      const titleMatch = recipe.title && recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const ingredientMatch = recipe.ingredients && Array.isArray(recipe.ingredients) && 
        recipe.ingredients.some(ing => {
          if (typeof ing === 'string') {
            return ing.toLowerCase().includes(searchTerm.toLowerCase());
          } else if (ing && typeof ing === 'object' && ing.name) {
            return ing.name.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        });
      
      return titleMatch || ingredientMatch;
    });

    switch (sortBy) {
      case 'name':
        return filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'ingredients':
        return filtered.sort((a, b) => {
          const aLength = Array.isArray(a.ingredients) ? a.ingredients.length : 0;
          const bLength = Array.isArray(b.ingredients) ? b.ingredients.length : 0;
          return aLength - bLength;
        });
      case 'recent':
      default:
        return filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }
  }, [recipes, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="bg-white border border-emerald-100 rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tus Recetas</h2>
          <div className="animate-pulse">
            <div className="h-10 w-32 bg-emerald-200 rounded-xl"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <SkeletonLoaders.RecipeCard />
          <SkeletonLoaders.RecipeCard />
          <SkeletonLoaders.RecipeCard />
          <SkeletonLoaders.RecipeCard />
          <SkeletonLoaders.RecipeCard />
          <SkeletonLoaders.RecipeCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar recetas</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => loadUserRecipes(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Calcular paginación
  const totalPages = Math.ceil(filteredAndSortedRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecipes = filteredAndSortedRecipes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Header simplificado - altura fija - siempre arriba */}
      <div className="bg-white border-b border-emerald-100 shadow-sm flex-shrink-0 sticky top-0 z-10 lg:static lg:z-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Mis Comidas</h1>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                {filteredAndSortedRecipes.length} recetas
              </span>
            </div>
            
            {/* Controles responsivos */}
            <div className="flex flex-col gap-4">
              {/* Botones principales en mobile, controles completos en desktop */}
              <div className="flex items-center justify-between">
                {/* Mobile: Botones simples */}
                <div className="flex lg:hidden items-center gap-3">
                  <button
                    onClick={() => setShowSearchInput(!showSearchInput)}
                    className={`p-2 rounded-lg transition-all ${showSearchInput ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}
                    title="Buscar recetas"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-all ${showFilters ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}
                    title="Filtros"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                  </button>

                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-all ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600'}`}
                      title="Vista en cuadrícula"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600'}`}
                      title="Vista en lista"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Desktop: Controles completos */}
                <div className="hidden lg:flex items-center gap-3">
                  {/* Barra de búsqueda */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar recetas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>

                  {/* Filtros */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="recent">Más recientes</option>
                    <option value="name">Por nombre</option>
                    <option value="ingredients">Por ingredientes</option>
                  </select>

                  {/* Toggle Grid/Lista */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-2 transition-all ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                      title="Vista en cuadrícula"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                      title="Vista en lista"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile: Input de búsqueda colapsable */}
              {showSearchInput && (
                <div className="lg:hidden" style={{ animation: 'slideDown 0.3s ease-out' }}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar recetas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* Mobile: Filtros colapsables */}
              {showFilters && (
                <div className="lg:hidden" style={{ animation: 'slideDown 0.3s ease-out' }}>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por:</label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { value: 'recent', label: 'Más recientes' },
                          { value: 'name', label: 'Por nombre' },
                          { value: 'ingredients', label: 'Por ingredientes' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setShowFilters(false);
                            }}
                            className={`p-3 text-left rounded-lg border transition-all ${
                              sortBy === option.value 
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - ocupa el resto de la pantalla */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto px-6 py-6 w-full">
        {filteredAndSortedRecipes.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-3xl opacity-20 blur-xl"></div>
                <div className="relative w-full h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {searchTerm ? 'No se encontraron recetas' : 'Tu aventura culinaria comienza aquí'}
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? `No hay recetas que coincidan con "${searchTerm}"`
                  : 'Crea recetas únicas con IA y descubre sabores increíbles'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={onCreateNew}
                  className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transform transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-emerald-500/25"
                >
                  <span className="relative z-10">Crear Mi Primera Receta</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Recipe Grid/List con altura ajustada */}
            <div className="flex-1">
              <div className="max-w-7xl mx-auto w-full">
                <div className={`${
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 py-4"
                    : "space-y-4 py-4"
                }`}>
                {currentRecipes.map((recipe, index) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      id={recipe.id}
                      title={recipe.title}
                      ingredients={recipe.ingredients}
                      instructions={recipe.recipe_metadata?.instructions}
                      metadata={recipe.recipe_metadata}
                      onDelete={handleDeleteRecipe}
                      viewMode={viewMode}
                    />
                ))}
                </div>
                
                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8 pb-8 lg:pb-4">
                    <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  
                  {/* Mostrar páginas */}
                  <div className="flex gap-1">
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        // Lógica para mostrar páginas alrededor de la actual
                        const start = Math.max(1, currentPage - 2);
                        pageNum = start + i;
                        if (pageNum > totalPages) return null;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-emerald-600 text-white'
                              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
              </div> {/* Cierre del container centralizado */}
            </div>
            
            {/* Floating Action Button - Más pequeño en mobile */}
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={onCreateNew}
                className="group w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-2xl hover:shadow-emerald-500/25 transform transition-all duration-300 hover:scale-110 flex items-center justify-center"
                title="Crear nueva receta"
              >
                <svg className="w-6 h-6 lg:w-8 lg:h-8 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
