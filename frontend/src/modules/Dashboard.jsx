import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { RecipeInput } from '../components/RecipeInput';
import NutritionProfile from '../pages/NutritionProfile';
import RecipeList from '../components/RecipeList.jsx';
import FeedbackToast from '../components/FeedbackToast';
import { recipeService } from '../services/recipe.js';

export function Dashboard({ user, onSignOut }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('main');
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  // Estados para toasts
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ visible: true, type, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  const handleRecipeSubmit = (data) => {
    // Evitar múltiples envíos
    if (isGeneratingRecipe) return;

    // Enviar datos al backend MCP para receta rápida
    (async () => {
      try {
        setIsGeneratingRecipe(true);
        const result = await recipeService.generateQuickRecipe(data);
        showToast('success', result?.title ? `Receta generada: ${result.title}` : 'Receta generada correctamente');
        // Opcional: mostrar más info en modal, etc.
      } catch (error) {
        showToast('error', error.message || 'Error al generar receta rápida');
      } finally {
        setIsGeneratingRecipe(false);
      }
    })();
  };

  const renderMainContent = () => {
    switch (currentSection) {
      case 'main':
        return (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 min-h-screen">
            <div className="text-center mb-8 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-900 mb-4 leading-tight">
                ¡Hola, <span className="text-emerald-600">{user?.email?.split('@')[0]}</span>!
              </h1>
              <p className="text-xl text-emerald-700 mb-2 leading-relaxed">
                ¿Qué tienes en tu nevera hoy?
              </p>
            </div>
            <RecipeInput
              onSubmit={handleRecipeSubmit}
              isGenerating={isGeneratingRecipe}
            />
            <div className="mt-8 text-center text-xs text-slate-500 max-w-md">
              <p className="mt-4 text-slate-400">
                Puedes describir ingredientes por texto, grabar un audio o subir una foto.
                Tu NeveraApp generará recetas personalizadas para ti.
              </p>
            </div>
          </div>
        );
      case 'dishes':
        return (
          <div className="flex-1 flex flex-col px-4 py-8 min-h-screen">
            <RecipeList onCreateNew={() => setCurrentSection('main')} />
          </div>
        );
      case 'nutrition':
        return (
          <div className="min-h-screen">
            <NutritionProfile user={user} onSave={(data) => {
              console.log('Preferencias nutricionales guardadas:', data);
              showToast('success', 'Preferencias guardadas correctamente');
            }} />
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 min-h-screen">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">Configuración</h2>
              <div className="space-y-6">
                {/* Información de cuenta */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Cuenta</h3>
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                    <p className="text-sm text-emerald-800">{user?.email}</p>
                    <p className="text-xs text-emerald-600 mt-1">Usuario verificado</p>
                  </div>
                </div>
                {/* Preferencias */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Preferencias</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                      <span className="ml-2 text-sm text-slate-600">Recibir notificaciones por email</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-slate-300" defaultChecked />
                      <span className="ml-2 text-sm text-slate-600">Guardar historial de recetas</span>
                    </label>
                  </div>
                </div>
                {/* Botón de logout alternativo */}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={onSignOut}
                    className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg hover:bg-red-100 transition-all shadow-sm text-sm font-medium border border-red-200"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSignOut={onSignOut}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header móvil */}
        <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center">
              <img
                src="/src/media/main_logo_without_background.png"
                alt="Tu NeveraApp"
                className="h-8 w-auto mr-2"
              />
              <h1 className="text-lg font-semibold text-emerald-900">Tu NeveraApp</h1>
            </div>
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </div>

        {/* Contenido principal */}
        {renderMainContent()}
      </div>

      {/* Toast de feedback */}
      <FeedbackToast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
