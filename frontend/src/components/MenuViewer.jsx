import React, { useState, useEffect } from 'react';

/**
 * Componente para visualizar el menú semanal guardado
 */
export function MenuViewer({ menu, onEdit, onDelete }) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Establecer el día actual como default
    const today = new Date();
    setCurrentDate(today);
    
    // Si hay menú, establecer el índice del día actual
    if (menu && menu.daily_menus) {
      const todayIndex = today.getDay(); // 0 = Domingo, 1 = Lunes, etc.
      const adjustedIndex = todayIndex === 0 ? 6 : todayIndex - 1; // Ajustar para que Lunes = 0
      setCurrentDayIndex(Math.min(adjustedIndex, menu.daily_menus.length - 1));
    }
  }, [menu]);

  if (!menu || !menu.daily_menus) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No hay menú disponible</h3>
          <p className="text-slate-600">Crea tu primer menú semanal</p>
        </div>
      </div>
    );
  }

  const dailyMenus = menu.daily_menus || [];
  const currentMenu = dailyMenus[currentDayIndex];

  const getDayName = (index) => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return days[index % 7];
  };

  const getMealTypeIcon = (mealType) => {
    const icons = {
      'Desayuno': '🌅',
      'Almuerzo': '☀️',
      'Comida': '🍽️',
      'Merienda': '🥪',
      'Cena': '🌙'
    };
    return icons[mealType] || '🍽️';
  };

  const navigateDay = (direction) => {
    if (direction === 'prev' && currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    } else if (direction === 'next' && currentDayIndex < dailyMenus.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const formatDate = (dayOffset) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + dayOffset - currentDayIndex);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header del menú */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{menu.title || 'Mi Menú Semanal'}</h2>
            <p className="text-slate-600">
              {menu.days} días • {menu.meals_per_day} comidas por día
            </p>
            {menu.metadata?.description && (
              <p className="text-sm text-slate-500 mt-2">{menu.metadata.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navegación por días */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateDay('prev')}
              disabled={currentDayIndex === 0}
              className="p-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800">
                {getDayName(currentDayIndex)}
              </h3>
              <p className="text-sm text-slate-600">
                {formatDate(currentDayIndex)}
              </p>
            </div>

            <button
              onClick={() => navigateDay('next')}
              disabled={currentDayIndex === dailyMenus.length - 1}
              className="p-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Indicador de días */}
        <div className="px-4 py-3 bg-slate-50">
          <div className="flex justify-center space-x-2">
            {dailyMenus.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentDayIndex(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  index === currentDayIndex
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Comidas del día */}
      <div className="space-y-4">
        {currentMenu && currentMenu.meals && currentMenu.meals.length > 0 ? (
          currentMenu.meals.map((meal, index) => (
            <MealCard key={index} meal={meal} index={index} />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-600">No hay comidas planificadas para este día</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Tarjeta individual para cada comida
 */
function MealCard({ meal, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMealTypeIcon = (mealType) => {
    const icons = {
      'Desayuno': '🌅',
      'Almuerzo': '☀️',
      'Comida': '🍽️',
      'Merienda': '🥪',
      'Cena': '🌙'
    };
    return icons[mealType] || '🍽️';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getMealTypeIcon(meal.meal_type)}</span>
            <div>
              <h4 className="font-semibold text-slate-800">
                {meal.meal_type || `Comida ${index + 1}`}
              </h4>
              <p className="text-slate-600">{meal.recipe_name || meal.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {meal.estimated_calories && (
              <span className="text-sm text-slate-500">
                {meal.estimated_calories} cal
              </span>
            )}
            <svg 
              className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          {meal.ingredients && meal.ingredients.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium text-slate-800 mb-2">Ingredientes:</h5>
              <div className="grid grid-cols-2 gap-1">
                {meal.ingredients.map((ingredient, idx) => (
                  <span key={idx} className="text-sm text-slate-600">
                    • {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {meal.cooking_time && (
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span>⏱️ {meal.cooking_time} min</span>
              {meal.difficulty && <span>👨‍🍳 {meal.difficulty}</span>}
            </div>
          )}

          {meal.description && (
            <div className="mt-3">
              <p className="text-sm text-slate-600 italic">"{meal.description}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
