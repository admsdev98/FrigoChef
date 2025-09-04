import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext.jsx';
import { getUserFriendlyMessage } from '../utils/responseMessages.js';
import { NutritionProfileSkeleton } from '../components/SkeletonLoaders.jsx';

export default function NutritionProfile({ user, onSave }) {
  const { nutritionalPreferences, loading: userLoading, updateNutritionalPreferences } = useUser();
  const [allergens, setAllergens] = useState([]);
  const [dietType, setDietType] = useState([]);
  const [preferredFoods, setPreferredFoods] = useState([]);
  const [avoidFoods, setAvoidFoods] = useState([]);
  const [favoriteDishes, setFavoriteDishes] = useState([]);
  const [saving, setSaving] = useState(false);

  const [input, setInput] = useState({
    allergens: '',
    dietType: '',
    preferredFoods: '',
    avoidFoods: '',
    favoriteDishes: ''
  });

  const [feedback, setFeedback] = useState({
    visible: false,
    type: 'success',
    message: ''
  });

  // Cargar preferencias desde el contexto (ya están cargadas)
  useEffect(() => {
    if (nutritionalPreferences) {
      console.log('Cargando preferencias desde contexto:', nutritionalPreferences);
      setAllergens(nutritionalPreferences.allergens || []);
      setDietType(nutritionalPreferences.diet_type || []);
      setPreferredFoods(nutritionalPreferences.preferred_foods || []);
      setAvoidFoods(nutritionalPreferences.avoid_foods || []);
      setFavoriteDishes(nutritionalPreferences.favorite_dishes || []);
    }
  }, [nutritionalPreferences]);

  // Mostrar skeleton mientras cargan los datos por primera vez
  if (userLoading && !nutritionalPreferences) {
    return <NutritionProfileSkeleton />;
  }

  // Añade palabra si no supera el límite y no está vacía
  const handleAdd = (key) => {
    const value = input[key].trim();
    if (!value || eval(key).length >= 5) return;
    // Evitar duplicados (case-insensitive)
    if (eval(key).some(item => item.toLowerCase() === value.toLowerCase())) return;
    eval('set' + key.charAt(0).toUpperCase() + key.slice(1))([...eval(key), value]);
    setInput({ ...input, [key]: '' });
  };

  // Elimina palabra
  const handleRemove = (key, idx) => {
    const arr = [...eval(key)];
    arr.splice(idx, 1);
    eval('set' + key.charAt(0).toUpperCase() + key.slice(1))(arr);
  };

  // Enviar datos al backend
  const handleSave = async () => {
    const nutritionData = {
      allergens,
      diet_type: dietType,
      preferred_foods: preferredFoods,
      avoid_foods: avoidFoods,
      favorite_dishes: favoriteDishes
    };

    setSaving(true);
    try {
      const success = await updateNutritionalPreferences(nutritionData);
      if (success) {
        setFeedback({
          visible: true,
          type: 'success',
          message: 'Preferencias guardadas correctamente.'
        });
        if (onSave) {
          onSave(nutritionData);
        }
      } else {
        setFeedback({
          visible: true,
          type: 'error',
          message: 'Error al guardar las preferencias. Inténtalo de nuevo.'
        });
      }
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      setFeedback({
        visible: true,
        type: 'error',
        message: getUserFriendlyMessage(error, 'guardar preferencias')
      });
    } finally {
      setSaving(false);
    }
    
    // Ocultar feedback tras 3 segundos
    setTimeout(() => setFeedback(f => ({ ...f, visible: false })), 3000);
  };

  // Renderiza los chips con colores personalizados
    const renderChips = (field, items) => {
    return (
      <div className="flex flex-wrap gap-3 mt-3">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-xl text-sm font-semibold border border-gray-200 group hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {item}
            <button
              type="button"
              onClick={() => handleRemove(field, index)}
              className="ml-1 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 transform hover:scale-110"
              aria-label={`Eliminar ${item}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <div className="w-full text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 font-medium">
              No hay elementos añadidos
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Escribe arriba y presiona Enter o el botón +
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full px-4 py-6 overflow-hidden bg-gray-50">
      <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
        {/* Header estilizado */}
                {/* Header compacto */}
        <div className="text-center mb-4 lg:mb-6 flex-shrink-0">
          <p className="text-gray-600 text-sm lg:text-base mb-1">
            Cuéntanos tus gustos para personalizar tus recetas
          </p>
          <p className="text-emerald-600 text-xs lg:text-sm font-medium">
            Máximo 5 elementos por sección
          </p>
        </div>

        {/* Contenido estilizado */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Grid mejorado */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 min-h-0">
            
            {/* Alérgenos */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 flex flex-col min-h-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                  <span className="text-red-500 text-xl">🚫</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Alérgenos</h3>
                  <p className="text-gray-500 text-sm">Ingredientes que debes evitar</p>
                </div>
              </div>
                            <div className="flex flex-col gap-2 mb-3">
                <input
                  type="text"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all duration-200 hover:border-gray-400"
                  placeholder="gluten, huevo..."
                  value={input.allergens}
                  onChange={e => setInput({ ...input, allergens: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('allergens')) : null)}
                  maxLength={20}
                  disabled={allergens.length >= 5}
                />
                <button 
                  type="button" 
                  className="w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all duration-200 disabled:bg-gray-300 text-sm shadow-sm hover:shadow-md transform hover:scale-[1.02]" 
                  onClick={() => handleAdd('allergens')} 
                  disabled={allergens.length >= 5 || !input.allergens.trim()}
                >
                  Añadir
                </button>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                {renderChips('allergens', allergens)}
              </div>
            </div>

            {/* Tipo de dieta */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 flex flex-col min-h-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                  <span className="text-green-500 text-xl">🥗</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Dieta</h3>
                  <p className="text-gray-500 text-sm">Tu estilo de alimentación</p>
                </div>
              </div>
                            <div className="flex flex-col gap-2 mb-3">
                <input
                  type="text"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all duration-200 hover:border-gray-400"
                  placeholder="vegana, mediterránea..."
                  value={input.dietType}
                  onChange={e => setInput({ ...input, dietType: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('dietType')) : null)}
                  maxLength={20}
                  disabled={dietType.length >= 5}
                />
                <button 
                  type="button" 
                  className="w-full sm:w-auto px-6 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all duration-200 disabled:bg-gray-300 text-sm shadow-sm hover:shadow-md transform hover:scale-[1.02]" 
                  onClick={() => handleAdd('dietType')} 
                  disabled={dietType.length >= 5 || !input.dietType.trim()}
                >
                  Añadir
                </button>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                {renderChips('dietType', dietType)}
              </div>
            </div>

            {/* Alimentos favoritos */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 flex flex-col min-h-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center border border-yellow-100">
                  <span className="text-yellow-500 text-xl">❤️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Me gusta</h3>
                  <p className="text-gray-500 text-sm">Tus ingredientes favoritos</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder-gray-400 transition-all hover:border-gray-300"
                  placeholder="chocolate, aguacate..."
                  value={input.preferredFoods}
                  onChange={e => setInput({ ...input, preferredFoods: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('preferredFoods')) : null)}
                  maxLength={20}
                  disabled={preferredFoods.length >= 5}
                />
                <button 
                  type="button" 
                  className="w-full sm:w-auto px-5 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 text-sm shadow-sm hover:shadow-md transform hover:scale-105" 
                  onClick={() => handleAdd('preferredFoods')} 
                  disabled={preferredFoods.length >= 5 || !input.preferredFoods.trim()}
                >
                  Añadir
                </button>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                {renderChips('preferredFoods', preferredFoods)}
              </div>
            </div>

            {/* Alimentos que evitar */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 flex flex-col min-h-0 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                  <span className="text-gray-500 text-xl">👎</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">No me gusta</h3>
                  <p className="text-gray-500 text-sm">Alimentos a evitar</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder-gray-400 transition-all hover:border-gray-300"
                  placeholder="pimiento, brócoli..."
                  value={input.avoidFoods}
                  onChange={e => setInput({ ...input, avoidFoods: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('avoidFoods')) : null)}
                  maxLength={20}
                  disabled={avoidFoods.length >= 5}
                />
                <button 
                  type="button" 
                  className="w-full sm:w-auto px-5 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 text-sm shadow-sm hover:shadow-md transform hover:scale-105" 
                  onClick={() => handleAdd('avoidFoods')} 
                  disabled={avoidFoods.length >= 5 || !input.avoidFoods.trim()}
                >
                  Añadir
                </button>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                {renderChips('avoidFoods', avoidFoods)}
              </div>
            </div>
          </div>

          {/* Platos favoritos - Estilizado */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 flex-shrink-0 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                <span className="text-blue-500 text-xl">⭐</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Platos Favoritos</h3>
                <p className="text-gray-500 text-sm">Tus comidas de toda la vida</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4 max-w-3xl">
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder-gray-400 transition-all hover:border-gray-300"
                placeholder="paella, tacos, sushi..."
                value={input.favoriteDishes}
                onChange={e => setInput({ ...input, favoriteDishes: e.target.value })}
                onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('favoriteDishes')) : null)}
                maxLength={30}
                disabled={favoriteDishes.length >= 5}
              />
              <button 
                type="button" 
                className="w-full sm:w-auto px-5 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 text-sm shadow-sm hover:shadow-md transform hover:scale-105" 
                onClick={() => handleAdd('favoriteDishes')} 
                disabled={favoriteDishes.length >= 5 || !input.favoriteDishes.trim()}
              >
                Añadir
              </button>
            </div>
            {renderChips('favoriteDishes', favoriteDishes)}
          </div>
        </div>

        {/* Footer estilizado */}
        <div className="flex-shrink-0 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-gray-500 text-center sm:text-left">
              <div className="w-5 h-5 text-emerald-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm font-medium">
                Tus datos están seguros y nos ayudan a personalizar tus recetas
              </span>
            </div>
            <button 
              type="button" 
              className="group relative px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-base hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-56 transform hover:scale-105" 
              onClick={handleSave}
              disabled={saving}
            >
              <span className="flex items-center justify-center gap-3">
                {saving ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar preferencias
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Mensaje de feedback estilizado */}
          {feedback.visible && (
            <div className={`mt-6 p-4 rounded-2xl text-sm flex items-center gap-4 transform transition-all duration-500 shadow-sm ${
              feedback.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                feedback.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {feedback.type === 'success' ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                )}
              </div>
              <span className="font-semibold">{feedback.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}