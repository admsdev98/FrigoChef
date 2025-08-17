import React from 'react';

/**
 * Componente para mostrar chips (etiquetas) removibles
 */
export const ChipList = ({ items, onRemove, category }) => (
  <div className="flex flex-wrap gap-2 mt-3 min-h-[32px]">
    {items.map((item, index) => (
      <span 
        key={`${category}-${index}`} 
        className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-emerald-200"
      >
        {item}
        <button 
          type="button" 
          className="ml-1 text-emerald-600 hover:text-red-500 font-bold text-sm transition-colors" 
          onClick={() => onRemove(category, index)}
          title="Eliminar"
          aria-label={`Eliminar ${item}`}
        >
          ×
        </button>
      </span>
    ))}
  </div>
);
