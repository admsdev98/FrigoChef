import React, { useState } from "react";

const RecipeCard = ({ id, title, ingredients, instructions, metadata, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      setIsDeleting(true);
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Error al eliminar la receta:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow relative">
      {/* Botón de eliminar */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
        title="Eliminar receta"
      >
        {isDeleting ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-2 pr-8">{title}</h2>
      
      <div className="mb-2">
        <span className="font-semibold text-gray-600">Ingredientes:</span>
        <ul className="list-disc list-inside text-gray-700 mt-1">
          {ingredients?.map((ingredient) => (
            <li key={ingredient.id} className="text-sm">
              {ingredient.name} - {ingredient.quantity} {ingredient.unit}
            </li>
          ))}
        </ul>
      </div>
            
      {metadata && Object.keys(metadata).length > 0 && (
        <div className="text-xs text-gray-500 border-t pt-2">
          {Object.entries(metadata)
            .filter(([key, value]) => key !== 'instructions' && value)
            .map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-semibold capitalize">{key.replace('_', ' ')}:</span>
                <span>{value}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
