import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function RecipeModal({ recipe, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients' | 'instructions'

  if (!isOpen || !recipe) return null;

  // Normalize instructions
  let normalizedInstructions = [];
  if (Array.isArray(recipe.steps)) {
    if (recipe.steps.length > 0 && recipe.steps[0]?.step_number !== undefined) {
      normalizedInstructions = recipe.steps;
    } else if (recipe.steps.length > 0 && recipe.steps[0]?.instructions) {
      normalizedInstructions = recipe.steps.flatMap(stepObj => stepObj.instructions || []);
    }
  }

  // Helper to format time
  const formatTime = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins}m`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header Image Area */}
              <div className="relative h-64 sm:h-72 flex-shrink-0">
                <img
                  src={(Array.isArray(recipe.image) ? recipe.image[0]?.image_url : recipe.image?.image_url) || "/src/media/main_logo_without_background.png"}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
                
                {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Title & Meta */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">{recipe.title}</h2>
                  <div className="flex flex-wrap gap-3 text-sm font-medium">
                    {recipe.recipe_metadata?.tiempo_preparacion && (
                      <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(recipe.recipe_metadata.tiempo_preparacion)}
                      </span>
                    )}
                    {recipe.recipe_metadata?.dificultad && (
                      <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full capitalize">
                        {recipe.recipe_metadata.dificultad}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`flex-1 py-4 text-sm font-semibold text-center transition-colors relative ${
                    activeTab === 'ingredients' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Ingredientes
                  {activeTab === 'ingredients' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('instructions')}
                  className={`flex-1 py-4 text-sm font-semibold text-center transition-colors relative ${
                    activeTab === 'instructions' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Instrucciones
                  {activeTab === 'instructions' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                  )}
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                {activeTab === 'ingredients' ? (
                  <div className="space-y-3">
                    {recipe.ingredients?.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">
                          {typeof ingredient === 'string' ? ingredient : (
                            <>
                              {ingredient.quantity && <span className="text-emerald-600 font-bold">{ingredient.quantity} {ingredient.unit} </span>}
                              {ingredient.name}
                            </>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {normalizedInstructions.length > 0 ? (
                      normalizedInstructions.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">
                            {step.step_number || index + 1}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-gray-700 leading-relaxed">{step.instruction}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-gray-400">
                        <p>No hay instrucciones detalladas disponibles.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
