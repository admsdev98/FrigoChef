import React, { useState } from 'react';
import { ChipList } from './ChipList.jsx';

/**
 * Componente para configurar las preferencias del menú semanal
 */
export function MenuConfig({ onSubmit, isLoading = false }) {
  const [formData, setFormData] = useState({
    days: 7,
    meals_per_day: 3,
    target_calories_per_day: 2000,
    dietary_restrictions: [],
    preferred_cuisines: [],
    preferences: {
      meal_types: ['Desayuno', 'Almuerzo', 'Cena'],
      cooking_time: 'normal',
      difficulty: 'facil'
    }
  });

  const [newRestriction, setNewRestriction] = useState('');
  const [newCuisine, setNewCuisine] = useState('');

  const cookingTimes = [
    { value: 'rapido', label: 'Rápido (15-30 min)' },
    { value: 'normal', label: 'Normal (30-60 min)' },
    { value: 'lento', label: 'Elaborado (60+ min)' }
  ];

  const difficulties = [
    { value: 'facil', label: 'Fácil' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' }
  ];

  const commonCuisines = [
    'Mediterránea', 'Italiana', 'Asiática', 'Mexicana', 'Española', 
    'Francesa', 'India', 'Japonesa', 'Vegetariana', 'Vegana'
  ];

  const commonRestrictions = [
    'Sin gluten', 'Sin lactosa', 'Vegetariano', 'Vegano', 
    'Sin frutos secos', 'Bajo en sodio', 'Diabético'
  ];

  const addItem = (category, item) => {
    if (!item.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [category]: [...prev[category], item.trim()]
    }));
    
    if (category === 'dietary_restrictions') {
      setNewRestriction('');
    } else if (category === 'preferred_cuisines') {
      setNewCuisine('');
    }
  };

  const removeItem = (category, index) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Configura tu Menú Semanal</h2>
          <p className="text-slate-600">
            Personaliza tu menú según tus preferencias y necesidades nutricionales
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Configuración básica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Días del menú
              </label>
              <select
                value={formData.days}
                onChange={(e) => setFormData(prev => ({ ...prev, days: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={3}>3 días</option>
                <option value={5}>5 días</option>
                <option value={7}>7 días</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Comidas por día
              </label>
              <select
                value={formData.meals_per_day}
                onChange={(e) => setFormData(prev => ({ ...prev, meals_per_day: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value={2}>2 comidas</option>
                <option value={3}>3 comidas</option>
                <option value={4}>4 comidas</option>
                <option value={5}>5 comidas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Calorías por día
              </label>
              <input
                type="number"
                min="1200"
                max="4000"
                step="50"
                value={formData.target_calories_per_day}
                onChange={(e) => setFormData(prev => ({ ...prev, target_calories_per_day: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Tiempo de cocina y dificultad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tiempo de preparación
              </label>
              <select
                value={formData.preferences.cooking_time}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  preferences: { ...prev.preferences, cooking_time: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {cookingTimes.map(time => (
                  <option key={time.value} value={time.value}>{time.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Dificultad
              </label>
              <select
                value={formData.preferences.difficulty}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  preferences: { ...prev.preferences, difficulty: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Restricciones dietéticas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Restricciones dietéticas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newRestriction}
                onChange={(e) => setNewRestriction(e.target.value)}
                placeholder="Añadir restricción..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('dietary_restrictions', newRestriction);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addItem('dietary_restrictions', newRestriction)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Añadir
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {commonRestrictions.map(restriction => (
                <button
                  key={restriction}
                  type="button"
                  onClick={() => addItem('dietary_restrictions', restriction)}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                >
                  + {restriction}
                </button>
              ))}
            </div>

            <ChipList 
              items={formData.dietary_restrictions}
              onRemove={removeItem}
              category="dietary_restrictions"
            />
          </div>

          {/* Cocinas preferidas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipos de cocina preferidos
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCuisine}
                onChange={(e) => setNewCuisine(e.target.value)}
                placeholder="Añadir tipo de cocina..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('preferred_cuisines', newCuisine);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addItem('preferred_cuisines', newCuisine)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Añadir
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {commonCuisines.map(cuisine => (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => addItem('preferred_cuisines', cuisine)}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                >
                  + {cuisine}
                </button>
              ))}
            </div>

            <ChipList 
              items={formData.preferred_cuisines}
              onRemove={removeItem}
              category="preferred_cuisines"
            />
          </div>

          {/* Botón de envío */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Generando menú...
                </>
              ) : (
                'Generar Opciones de Menú'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
