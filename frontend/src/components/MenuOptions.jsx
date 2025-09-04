import React, { useState } from 'react';

/**
 * Componente para mostrar las opciones de menú generadas y permitir selección
 */
export function MenuOptions({ options, onSelect, onGoBack, isLoading = false }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [expandedOption, setExpandedOption] = useState(null);

  const handleSelect = (option, index) => {
    setSelectedOption(index);
    onSelect(option);
  };

  const toggleExpanded = (index) => {
    setExpandedOption(expandedOption === index ? null : index);
  };

  if (!options || options.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No se pudieron generar opciones</h3>
          <p className="text-slate-600 mb-4">Por favor, intenta ajustar tus preferencias</p>
          <button
            onClick={onGoBack}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Volver a configurar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Elige tu Menú Semanal</h2>
        <p className="text-slate-600">Hemos generado 3 opciones personalizadas para ti</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {options.map((option, index) => (
          <MenuOptionCard
            key={index}
            option={option}
            index={index}
            isSelected={selectedOption === index}
            isExpanded={expandedOption === index}
            onSelect={() => handleSelect(option, index)}
            onToggleExpanded={() => toggleExpanded(index)}
            isLoading={isLoading && selectedOption === index}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onGoBack}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Volver a configurar
        </button>
      </div>
    </div>
  );
}

/**
 * Tarjeta individual para cada opción de menú
 */
function MenuOptionCard({ option, index, isSelected, isExpanded, onSelect, onToggleExpanded, isLoading }) {
  const getBadgeColor = (index) => {
    const colors = [
      'bg-emerald-100 text-emerald-700',
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700'
    ];
    return colors[index] || 'bg-slate-100 text-slate-700';
  };

  const getOptionLabel = (index) => {
    const labels = ['Opción A', 'Opción B', 'Opción C'];
    return labels[index] || `Opción ${index + 1}`;
  };

  return (
    <div className={`
      bg-white rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer
      ${isSelected ? 'border-emerald-500 shadow-md' : 'border-slate-200 hover:border-slate-300'}
    `}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(index)}`}>
            {getOptionLabel(index)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpanded();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg 
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Información básica */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Días:</span>
            <span className="font-medium">{option.days} días</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Comidas por día:</span>
            <span className="font-medium">{option.meals_per_day}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Calorías promedio:</span>
            <span className="font-medium">{option.avg_calories_per_day || 'N/A'} cal/día</span>
          </div>
          {option.description && (
            <div className="text-sm text-slate-600 mt-2">
              <p className="italic">"{option.description}"</p>
            </div>
          )}
        </div>

        {/* Preview expandible */}
        {isExpanded && (
          <div className="border-t border-slate-200 pt-4 mt-4">
            <h4 className="font-medium text-slate-800 mb-3">Vista previa del menú:</h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {option.menu_preview && option.menu_preview.length > 0 ? (
                option.menu_preview.map((day, dayIndex) => (
                  <div key={dayIndex} className="border border-slate-100 rounded-lg p-3">
                    <h5 className="font-medium text-sm text-slate-700 mb-2">
                      Día {day.day || dayIndex + 1}
                    </h5>
                    <div className="space-y-1">
                      {day.meals && day.meals.map((meal, mealIndex) => (
                        <div key={mealIndex} className="flex justify-between text-xs">
                          <span className="text-slate-600">{meal.meal_type || `Comida ${mealIndex + 1}`}:</span>
                          <span className="text-slate-800 font-medium truncate ml-2">{meal.recipe_name || meal.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500 text-center py-4">
                  Vista previa no disponible
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botón de selección */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          disabled={isLoading}
          className={`
            w-full mt-4 px-4 py-3 rounded-lg font-medium transition-all duration-200
            ${isSelected 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          `}
        >
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Guardando...
            </>
          ) : isSelected ? (
            'Opción Seleccionada'
          ) : (
            'Seleccionar esta opción'
          )}
        </button>
      </div>
    </div>
  );
}
