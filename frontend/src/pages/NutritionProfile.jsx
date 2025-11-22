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

  // Renderiza los chips de forma simple
  const renderChips = (field, items) => {
    return items.map((item, index) => (
      <span
        key={index}
        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm border"
      >
        {item}
        <button
          type="button"
          onClick={() => handleRemove(field, index)}
          className="text-gray-500 hover:text-red-500 ml-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
    ));
  };

  return (
    <div className="flex-1 flex flex-col h-full p-4 overflow-hidden bg-gray-50">
      <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
        {/* Header simplificado */}
        <div className="text-center mb-6 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Cuéntanos tus gustos para personalizar tus recetas
          </h2>
          <p className="text-emerald-600 text-sm">
            Máximo 5 elementos por sección
          </p>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            
            {/* Alérgenos */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Alérgenos</h3>
              <p className="text-sm text-gray-600 mb-3">Ingredientes que debes evitar</p>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ej: gluten, huevo..."
                  value={input.allergens}
                  onChange={e => setInput({ ...input, allergens: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('allergens')) : null)}
                  maxLength={20}
                  disabled={allergens.length >= 5}
                />
                <button 
                  type="button" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:bg-gray-300" 
                  onClick={() => handleAdd('allergens')} 
                  disabled={allergens.length >= 5 || !input.allergens.trim()}
                >
                  Añadir
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {allergens.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm border"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemove('allergens', index)}
                      className="text-gray-500 hover:text-red-500 ml-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Tipo de dieta */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Tipo de Dieta</h3>
              <p className="text-sm text-gray-600 mb-3">Tu estilo de alimentación</p>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ej: vegana, mediterránea..."
                  value={input.dietType}
                  onChange={e => setInput({ ...input, dietType: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('dietType')) : null)}
                  maxLength={20}
                  disabled={dietType.length >= 5}
                />
                <button 
                  type="button" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:bg-gray-300" 
                  onClick={() => handleAdd('dietType')} 
                  disabled={dietType.length >= 5 || !input.dietType.trim()}
                >
                  Añadir
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {dietType.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm border"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemove('dietType', index)}
                      className="text-gray-500 hover:text-red-500 ml-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Alimentos favoritos */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Me Gusta</h3>
              <p className="text-sm text-gray-600 mb-3">Tus ingredientes favoritos</p>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ej: chocolate, aguacate..."
                  value={input.preferredFoods}
                  onChange={e => setInput({ ...input, preferredFoods: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('preferredFoods')) : null)}
                  maxLength={20}
                  disabled={preferredFoods.length >= 5}
                />
                <button 
                  type="button" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:bg-gray-300" 
                  onClick={() => handleAdd('preferredFoods')} 
                  disabled={preferredFoods.length >= 5 || !input.preferredFoods.trim()}
                >
                  Añadir
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {preferredFoods.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm border"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemove('preferredFoods', index)}
                      className="text-gray-500 hover:text-red-500 ml-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Alimentos que evitar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">No Me Gusta</h3>
              <p className="text-sm text-gray-600 mb-3">Alimentos a evitar</p>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ej: pimiento, brócoli..."
                  value={input.avoidFoods}
                  onChange={e => setInput({ ...input, avoidFoods: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('avoidFoods')) : null)}
                  maxLength={20}
                  disabled={avoidFoods.length >= 5}
                />
                <button 
                  type="button" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:bg-gray-300" 
                  onClick={() => handleAdd('avoidFoods')} 
                  disabled={avoidFoods.length >= 5 || !input.avoidFoods.trim()}
                >
                  Añadir
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {avoidFoods.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm border"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemove('avoidFoods', index)}
                      className="text-gray-500 hover:text-red-500 ml-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Platos favoritos */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Platos Favoritos</h3>
              <p className="text-sm text-gray-600 mb-3">Tus comidas de toda la vida</p>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Ej: paella, tacos, sushi..."
                  value={input.favoriteDishes}
                  onChange={e => setInput({ ...input, favoriteDishes: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('favoriteDishes')) : null)}
                  maxLength={30}
                  disabled={favoriteDishes.length >= 5}
                />
                <button 
                  type="button" 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700 disabled:bg-gray-300" 
                  onClick={() => handleAdd('favoriteDishes')} 
                  disabled={favoriteDishes.length >= 5 || !input.favoriteDishes.trim()}
                >
                  Añadir
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {favoriteDishes.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm border"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemove('favoriteDishes', index)}
                      className="text-gray-500 hover:text-red-500 ml-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer simplificado */}
        <div className="flex-shrink-0 pt-4">
          <div className="text-center">
            <button 
              type="button" 
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed" 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin inline mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar preferencias'
              )}
            </button>
            
            {/* Mensaje de feedback */}
            {feedback.visible && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                feedback.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {feedback.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}