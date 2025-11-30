import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext.jsx';
import { getUserFriendlyMessage } from '../utils/responseMessages.js';
import { NutritionProfileSkeleton } from '../components/SkeletonLoaders.jsx';
import FeedbackToast from '../components/FeedbackToast';
import { LoadingButton } from '../components/UIComponents';

const SECTIONS = [
  {
    id: 'dietType',
    title: 'Tipo de Dieta',
    subtitle: '¿Sigues alguna dieta específica?',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-emerald-50 text-emerald-600',
    placeholder: 'Ej: vegana, keto...',
    commonOptions: ['Vegetariana', 'Vegana', 'Sin Gluten', 'Keto', 'Paleo', 'Mediterránea']
  },
  {
    id: 'allergens',
    title: 'Alérgenos',
    subtitle: 'Ingredientes que debemos evitar',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    color: 'bg-amber-50 text-amber-600',
    placeholder: 'Ej: gluten, cacahuetes...',
    commonOptions: ['Gluten', 'Lácteos', 'Huevos', 'Frutos Secos', 'Marisco', 'Soja']
  },
  {
    id: 'preferredFoods',
    title: 'Me Gusta',
    subtitle: 'Lo que comerias todos los días',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    color: 'bg-rose-50 text-rose-600',
    placeholder: 'Ej: aguacate, chocolate...',
    commonOptions: ['Aguacate', 'Pollo', 'Pasta', 'Chocolate', 'Queso', 'Salmón']
  },
  {
    id: 'avoidFoods',
    title: 'No Me Gusta',
    subtitle: 'Que ingredientes no te llevarias a una isla desierta.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    color: 'bg-slate-100 text-slate-600',
    placeholder: 'Ej: cilantro, cebolla...',
    commonOptions: ['Cilantro', 'Cebolla', 'Pimiento', 'Brócoli', 'Pasas', 'Hígado']
  },
  {
    id: 'favoriteDishes',
    title: 'Platos Favoritos',
    subtitle: '¿Que platos te han enamorado?',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'bg-indigo-50 text-indigo-600',
    placeholder: 'Ej: paella, pizza...',
    commonOptions: ['Pizza', 'Sushi', 'Hamburguesa', 'Paella', 'Tacos', 'Lasaña'],
    maxLength: 30
  }
];

export default function NutritionProfile({ user, onSave }) {
  const { nutritionalPreferences, loading: userLoading, updateNutritionalPreferences } = useUser();
  const scrollContainerRef = useRef(null);
  
  const [preferences, setPreferences] = useState({
    allergens: [],
    dietType: [],
    preferredFoods: [],
    avoidFoods: [],
    favoriteDishes: []
  });

  const [inputs, setInputs] = useState({
    allergens: '',
    dietType: '',
    preferredFoods: '',
    avoidFoods: '',
    favoriteDishes: ''
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ visible: false, type: 'success', message: '' });
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    if (nutritionalPreferences) {
      setPreferences({
        allergens: nutritionalPreferences.allergens || [],
        dietType: nutritionalPreferences.dietType || [],
        preferredFoods: nutritionalPreferences.preferredFoods || [],
        avoidFoods: nutritionalPreferences.avoidFoods || [],
        favoriteDishes: nutritionalPreferences.favoriteDishes || []
      });
    }
  }, [nutritionalPreferences]);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const sections = SECTIONS.map(s => document.getElementById(`section-${s.id}`));
      
      // Find the section closest to the top
      let current = SECTIONS[0].id;
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          // 150px offset for header
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section.id.replace('section-', '');
            break;
          }
        }
      }
      setActiveSection(current);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (userLoading && !nutritionalPreferences) {
    return <NutritionProfileSkeleton />;
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  const handleInputChange = (sectionId, value) => {
    setInputs(prev => ({ ...prev, [sectionId]: value }));
  };

  const addItem = (sectionId, value) => {
    const trimmedValue = value.trim();
    const currentList = preferences[sectionId];
    
    if (!trimmedValue || currentList.length >= 5) return;
    if (currentList.some(item => item.toLowerCase() === trimmedValue.toLowerCase())) return;

    setPreferences(prev => ({
      ...prev,
      [sectionId]: [...prev[sectionId], trimmedValue]
    }));
    
    setInputs(prev => ({ ...prev, [sectionId]: '' }));
  };

  const removeItem = (sectionId, itemToRemove) => {
    setPreferences(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].filter(item => item !== itemToRemove)
    }));
  };

  const toggleOption = (sectionId, option) => {
    const currentList = preferences[sectionId];
    const exists = currentList.some(item => item.toLowerCase() === option.toLowerCase());

    if (exists) {
      removeItem(sectionId, option);
    } else {
      addItem(sectionId, option);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateNutritionalPreferences(preferences);
      if (success) {
        setFeedback({ visible: true, type: 'success', message: '¡Preferencias actualizadas!' });
        if (onSave) onSave(preferences);
      } else {
        throw new Error('Error al guardar');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setFeedback({ 
        visible: true, 
        type: 'error', 
        message: getUserFriendlyMessage(error, 'guardar preferencias') 
      });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(prev => ({ ...prev, visible: false })), 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50 relative">
      
      {/* Sticky Navigation Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex overflow-x-auto custom-scrollbar-hidden py-3 px-4 gap-2">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`
                  flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  ${activeSection === section.id 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto custom-scrollbar z-10 scroll-smooth"
      >
        <div className="max-w-5xl mx-auto px-4 py-8 pb-32 md:pb-12">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center md:text-left"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Perfil Nutricional
            </h2>
            <p className="text-gray-500 text-base">
              Adapta las recetas en base a tus preferencias nutricionales.
            </p>
          </motion.div>

          {/* Main Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-2"
          >
            {SECTIONS.map((section) => (
              <motion.div 
                key={section.id}
                id={`section-${section.id}`}
                variants={itemVariants}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-emerald-200 transition-colors duration-300 scroll-mt-24"
              >
                <div className="p-5">
                  {/* Card Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`p-2.5 rounded-lg ${section.color} bg-opacity-50`}>
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-500">{section.subtitle}</p>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder={section.placeholder}
                      value={inputs[section.id]}
                      onChange={(e) => handleInputChange(section.id, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(section.id, inputs[section.id]))}
                      maxLength={section.maxLength || 20}
                      disabled={preferences[section.id].length >= 5}
                    />
                    <button
                      type="button"
                      onClick={() => addItem(section.id, inputs[section.id])}
                      disabled={!inputs[section.id].trim() || preferences[section.id].length >= 5}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-600 hover:bg-emerald-50 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Quick Select Pills */}
                  <div className="mb-5">
                    <div className="flex flex-wrap gap-2">
                      {section.commonOptions.map((option) => {
                        const isSelected = preferences[section.id].some(
                          item => item.toLowerCase() === option.toLowerCase()
                        );
                        return (
                          <button
                            key={option}
                            onClick={() => toggleOption(section.id, option)}
                            disabled={!isSelected && preferences[section.id].length >= 5}
                            className={`
                              px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 border
                              ${isSelected 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-200 hover:text-emerald-600'
                              }
                              ${!isSelected && preferences[section.id].length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Items Chips */}
                  <div className="min-h-[36px]">
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence mode="popLayout">
                        {preferences[section.id].map((item) => (
                          <motion.span
                            key={item}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            layout
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-sm border border-gray-200"
                          >
                            {item}
                            <button
                              type="button"
                              onClick={() => removeItem(section.id, item)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                      {preferences[section.id].length === 0 && (
                        <span className="text-sm text-gray-400 italic">Sin selección</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50 md:static md:bg-transparent md:border-0 md:mt-auto md:p-6">
        <div className="max-w-5xl mx-auto flex justify-center md:justify-end">
          <LoadingButton
            isLoading={saving}
            onClick={handleSave}
            className="w-full md:w-auto px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors active:scale-95 flex items-center justify-center text-base"
          >
            <span>Guardar Cambios</span>
          </LoadingButton>
        </div>
      </div>

      <FeedbackToast
        visible={feedback.visible}
        type={feedback.type}
        message={feedback.message}
        onClose={() => setFeedback(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}