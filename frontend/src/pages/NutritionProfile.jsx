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

  // Renderiza los chips
  const renderChips = (key, arr) => (
    <div className="flex flex-wrap gap-2 mt-3 min-h-[32px]">
      {arr.map((word, idx) => (
        <span key={idx} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-emerald-200">
          {word}
          <button 
            type="button" 
            className="ml-1 text-emerald-600 hover:text-red-500 font-bold text-sm transition-colors" 
            onClick={() => handleRemove(key, idx)}
            title="Eliminar"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex-1 px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-none lg:max-w-6xl xl:max-w-7xl mx-auto lg:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Perfil nutricional</h2>
          <p className="text-lg text-slate-600 mb-2">
            Cuéntanos tus gustos para personalizar tus recetas
          </p>
          <p className="text-sm text-slate-500">
            Puedes añadir hasta 5 elementos en cada sección
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 xl:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Alérgenos */}
            <div className="space-y-4">
              <label className="block text-lg lg:text-xl font-semibold text-slate-800">Alérgenos</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                  placeholder="Ej: gluten, huevo..."
                  value={input.allergens}
                  onChange={e => setInput({ ...input, allergens: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('allergens')) : null)}
                  maxLength={20}
                  disabled={allergens.length >= 5}
                />
                <button 
                  type="button" 
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:bg-slate-300 text-base whitespace-nowrap" 
                  onClick={() => handleAdd('allergens')} 
                  disabled={allergens.length >= 5 || !input.allergens.trim()}
                >
                  Añadir
                </button>
              </div>
              {renderChips('allergens', allergens)}
            </div>

            {/* Tipo de dieta */}
            <div className="space-y-4">
              <label className="block text-lg lg:text-xl font-semibold text-slate-800">Tipo de dieta preferida</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                  placeholder="Ej: vegana, keto..."
                  value={input.dietType}
                  onChange={e => setInput({ ...input, dietType: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('dietType')) : null)}
                  maxLength={20}
                  disabled={dietType.length >= 5}
                />
                <button 
                  type="button" 
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:bg-slate-300 text-base whitespace-nowrap" 
                  onClick={() => handleAdd('dietType')} 
                  disabled={dietType.length >= 5 || !input.dietType.trim()}
                >
                  Añadir
                </button>
              </div>
              {renderChips('dietType', dietType)}
            </div>

            {/* 5 alimentos que te llevarías a una isla */}
            <div className="space-y-4">
              <label className="block text-lg lg:text-xl font-semibold text-slate-800">5 alimentos que te llevarías a una isla</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                  placeholder="Ej: chocolate, pizza..."
                  value={input.preferredFoods}
                  onChange={e => setInput({ ...input, preferredFoods: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('preferredFoods')) : null)}
                  maxLength={20}
                  disabled={preferredFoods.length >= 5}
                />
                <button 
                  type="button" 
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:bg-slate-300 text-base whitespace-nowrap" 
                  onClick={() => handleAdd('preferredFoods')} 
                  disabled={preferredFoods.length >= 5 || !input.preferredFoods.trim()}
                >
                  Añadir
                </button>
              </div>
              {renderChips('preferredFoods', preferredFoods)}
            </div>

            {/* 5 alimentos que te caigan mal */}
            <div className="space-y-4">
              <label className="block text-lg lg:text-xl font-semibold text-slate-800">5 alimentos que te caigan mal</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                  placeholder="Ej: pimiento, brócoli..."
                  value={input.avoidFoods}
                  onChange={e => setInput({ ...input, avoidFoods: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('avoidFoods')) : null)}
                  maxLength={20}
                  disabled={avoidFoods.length >= 5}
                />
                <button 
                  type="button" 
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:bg-slate-300 text-base whitespace-nowrap" 
                  onClick={() => handleAdd('avoidFoods')} 
                  disabled={avoidFoods.length >= 5 || !input.avoidFoods.trim()}
                >
                  Añadir
                </button>
              </div>
              {renderChips('avoidFoods', avoidFoods)}
            </div>

            {/* 5 platos preferidos */}
            <div className="space-y-4 lg:col-span-2">
              <label className="block text-lg lg:text-xl font-semibold text-slate-800">5 platos preferidos</label>
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                  placeholder="Ej: paella, tacos..."
                  value={input.favoriteDishes}
                  onChange={e => setInput({ ...input, favoriteDishes: e.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? (e.preventDefault(), handleAdd('favoriteDishes')) : null)}
                  maxLength={30}
                  disabled={favoriteDishes.length >= 5}
                />
                <button 
                  type="button" 
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:bg-slate-300 text-base whitespace-nowrap" 
                  onClick={() => handleAdd('favoriteDishes')} 
                  disabled={favoriteDishes.length >= 5 || !input.favoriteDishes.trim()}
                >
                  Añadir
                </button>
              </div>
              <div className="flex justify-center">
                {renderChips('favoriteDishes', favoriteDishes)}
              </div>
            </div>
          </div>

          {/* Botón guardar */}
          <button 
            type="button" 
            className="w-full mt-8 lg:mt-12 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar preferencias'}
          </button>

          {/* Mensaje de feedback */}
          {feedback.visible && (
            <div className={`mt-4 p-4 rounded-lg text-sm flex items-center gap-2 ${
              feedback.type === 'success' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-red-100 text-red-800'
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
              {feedback.message}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-slate-400 max-w-md mx-auto">
          <p>
            Tus preferencias se guardarán de forma segura y nos ayudarán a generar recetas más personalizadas para ti.
          </p>
        </div>
      </div>
    </div>
  );
}