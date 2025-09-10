import React, { useState } from "react";
import { ConfirmDialog } from "./UIComponents.jsx";

const RecipeCard = ({ id, title, ingredients, instructions, metadata, onDelete, viewMode = 'grid' }) => {
  // Normaliza instrucciones: soporta array plano o array de objetos con campo instructions (jsonb)
  let normalizedInstructions = [];
  if (Array.isArray(instructions)) {
    // Si es [{step_number, instruction}, ...] (plano)
    if (instructions.length > 0 && instructions[0]?.step_number !== undefined && instructions[0]?.instruction !== undefined) {
      normalizedInstructions = instructions;
    } else if (instructions.length > 0 && instructions[0]?.instructions) {
      // Si es [{..., instructions: [{step_number, instruction}, ...]}, ...]
      normalizedInstructions = instructions.flatMap(stepObj => stepObj.instructions || []);
    }
  }
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipContent, setFlipContent] = useState('ingredients'); // 'ingredients' o 'instructions'
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setShowConfirm(false);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Error al eliminar la receta:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // handleDelete y handleConfirmDelete ya definidos correctamente más abajo

  const handleShowIngredients = () => {
    setFlipContent('ingredients');
    setIsFlipped(true);
  };

  const handleShowInstructions = () => {
    setFlipContent('instructions');
    setIsFlipped(true);
  };

  const formatTime = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil': return 'text-green-600 bg-green-100';
      case 'medio': return 'text-yellow-600 bg-yellow-100';
      case 'difícil': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (viewMode === 'list') {
    return (
      <>
        <ConfirmDialog
          open={showConfirm}
          title="Eliminar receta"
          message="¿Estás seguro de que quieres eliminar esta receta? Esta acción no se puede deshacer."
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 recipe-card-hover">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {metadata?.tiempo_preparacion && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(metadata.tiempo_preparacion)}
                        </span>
                      )}
                      {metadata?.dificultad && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(metadata.dificultad)}`}>
                          {metadata.dificultad}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Ingredientes: </span>
                      {ingredients?.slice(0, 3).map(ing => ing.name).join(', ')}
                      {ingredients?.length > 3 && ` y ${ingredients.length - 3} más...`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handleShowIngredients}
                  className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Ver ingredientes"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Eliminar receta"
                >
                  {isDeleting ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Vista Grid con efecto flip
  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        title="Eliminar receta"
        message="¿Estás seguro de que quieres eliminar esta receta? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
      <div className="recipe-flip-container h-96 w-full max-w-sm mx-auto perspective-1000 group">
      <div className={`recipe-flip-card w-full h-full relative transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Frente de la tarjeta */}
        <div className="recipe-flip-face recipe-flip-front absolute inset-0 w-full h-full bg-white rounded-3xl overflow-hidden backface-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100">
          
          {/* IMAGEN */}
          <div className="relative h-48 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 overflow-hidden">
            <img 
              src="/src/media/main_logo_without_background.png" 
              alt="Recipe"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            
            {/* Botón de eliminar */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50 transform hover:scale-110 backdrop-blur-sm"
              title="Eliminar receta"
            >
              {isDeleting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>

          {/* TITULO DE LA RECETA */}
          <div className="p-6 flex flex-col h-48">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{title}</h3>
              
              {/* Metadatos */}
              <div className="flex flex-wrap gap-2 mb-3">
                {metadata?.tiempo_preparacion && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(metadata.tiempo_preparacion)}
                  </span>
                )}
                {metadata?.dificultad && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(metadata.dificultad)}`}>
                    {metadata.dificultad}
                  </span>
                )}
              </div>
            </div>
            
            {/* BOTONES */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleShowIngredients}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-200 text-sm font-medium transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
              >
                Ver Ingredientes
              </button>
              <button
                onClick={handleShowInstructions}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-200 text-sm font-medium transform hover:scale-105 shadow-lg"
              >
                Ver Instrucciones
              </button>
            </div>
          </div>
        </div>

        {/* Reverso de la tarjeta */}
        <div className="recipe-flip-face recipe-flip-back absolute inset-0 w-full h-full bg-white rounded-3xl overflow-hidden backface-hidden shadow-xl border border-gray-100 transform rotate-y-180">
          <div className="p-6 h-full flex flex-col">
            {/* Header del reverso */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">
                {flipContent === 'ingredients' ? 'Ingredientes' : 'Instrucciones'}
              </h4>
              <button
                onClick={() => setIsFlipped(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Volver"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Contenido del reverso */}
            <div className="flex-1 overflow-hidden">
              {flipContent === 'ingredients' ? (
                <div className="h-full overflow-y-auto custom-scrollbar-hidden space-y-2">
                  {ingredients?.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">
                        {ingredient.quantity && ingredient.unit 
                          ? `${ingredient.quantity} ${ingredient.unit} de ${ingredient.name}`
                          : ingredient.name
                        }
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full overflow-y-auto custom-scrollbar-hidden">
                  {normalizedInstructions && normalizedInstructions.length > 0 ? (
                    <div className="space-y-3">
                      {normalizedInstructions.map((step, index) => (
                        <div key={index} className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {step.step_number}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {step.instruction}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 font-medium">Sin instrucciones</p>
                        <p className="text-sm text-gray-400 mt-1">Esta receta no tiene pasos detallados</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RecipeCard;
