import React, { useState } from "react";
import { ConfirmDialog } from "./UIComponents.jsx";
import { RecipeModal } from "./RecipeModal.jsx";

const RecipeCard = ({ id, title, ingredients, instructions, metadata, image, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
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

  const formatTime = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  // Reconstruct recipe object for modal
  const recipeForModal = {
    id,
    title,
    ingredients,
    steps: instructions, // instructions prop is passed as steps to modal
    recipe_metadata: metadata,
    image
  };

  return (
    <>
      <ConfirmDialog
        open={showConfirm}
        title="Eliminar receta"
        message="¿Estás seguro de que quieres eliminar esta receta? Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />

      <RecipeModal 
        recipe={recipeForModal}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <div 
        onClick={() => setShowModal(true)}
        className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
      >
        {/* Image Section */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
          <img
            src={(Array.isArray(image) ? image[0]?.image_url : image?.image_url) || "/src/media/main_logo_without_background.png"}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${(!image?.image_url && (!Array.isArray(image) || !image[0]?.image_url)) ? 'opacity-50 p-8' : ''}`}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Delete Button - Top Right */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-3 right-3 p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-all duration-200 z-10 opacity-100"
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

          {/* Metadata Badges - Bottom Left over Image */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {metadata?.tiempo_preparacion && (
              <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-black/40 text-white backdrop-blur-md border border-white/10">
                <svg className="w-3 h-3 mr-1 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(metadata.tiempo_preparacion)}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>{ingredients?.length || 0} Ingredientes</span>
            </div>
            {metadata?.dificultad && (
               <div className="flex items-center gap-1.5 capitalize">
                 <span className={`w-2 h-2 rounded-full ${
                   metadata.dificultad.toLowerCase() === 'fácil' ? 'bg-emerald-500' :
                   metadata.dificultad.toLowerCase() === 'medio' ? 'bg-yellow-500' : 'bg-red-500'
                 }`}></span>
                 {metadata.dificultad}
               </div>
            )}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Ver receta
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeCard;

