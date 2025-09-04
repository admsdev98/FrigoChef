import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { RecipeInput } from '../components/RecipeInput';
import { MenuConfig } from '../components/MenuConfig';
import { MenuOptions } from '../components/MenuOptions';
import { MenuViewer } from '../components/MenuViewer';
import NutritionProfile from '../pages/NutritionProfile';
import RecipeList from '../components/RecipeList.jsx';
import FeedbackToast from '../components/FeedbackToast';
import { menuService } from '../services/menu.js';

export function Dashboard({ user, onSignOut }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('main');
  
  // Estados para el menú semanal
  const [menuState, setMenuState] = useState('loading'); // 'loading', 'configure', 'options', 'saved'
  const [menuConfig, setMenuConfig] = useState(null);
  const [menuOptions, setMenuOptions] = useState([]);
  const [savedMenu, setSavedMenu] = useState(null);
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  // Estados para toasts
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });

  const showToast = (type, message) => {
    setToast({ visible: true, type, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Cargar menú activo al inicializar la sección de menú
  useEffect(() => {
    if (currentSection === 'menu') {
      loadActiveMenu();
    }
  }, [currentSection]);

  const loadActiveMenu = async () => {
    try {
      setMenuState('loading');
      const activeMenu = await menuService.getActiveWeeklyMenu();
      
      if (activeMenu) {
        setSavedMenu(activeMenu);
        setMenuState('saved');
      } else {
        setMenuState('configure');
      }
    } catch (error) {
      console.error('Error al cargar menú activo:', error);
      setMenuState('configure');
    }
  };

  const handleMenuConfigSubmit = async (config) => {
    try {
      setIsMenuLoading(true);
      setMenuConfig(config);
      
      const options = await menuService.generateMenuOptions(config);
      setMenuOptions(options);
      setMenuState('options');
      showToast('success', '¡Opciones de menú generadas correctamente!');
    } catch (error) {
      console.error('Error al generar opciones de menú:', error);
      showToast('error', 'Error al generar opciones de menú. Por favor, intenta de nuevo.');
    } finally {
      setIsMenuLoading(false);
    }
  };

  const handleMenuOptionSelect = async (selectedOption) => {
    try {
      setIsMenuLoading(true);
      
      const savedMenu = await menuService.saveSelectedMenu(selectedOption, menuConfig);
      setSavedMenu(savedMenu);
      setMenuState('saved');
      showToast('success', '¡Menú guardado correctamente!');
    } catch (error) {
      console.error('Error al guardar menú seleccionado:', error);
      showToast('error', 'Error al guardar el menú. Por favor, intenta de nuevo.');
    } finally {
      setIsMenuLoading(false);
    }
  };

  const handleMenuEdit = () => {
    setMenuState('configure');
    showToast('success', 'Editando configuración del menú');
  };

  const handleMenuDelete = async () => {
    if (savedMenu && window.confirm('¿Estás seguro de que quieres eliminar este menú?')) {
      try {
        await menuService.deleteMenu(savedMenu.id);
        setSavedMenu(null);
        setMenuState('configure');
        showToast('success', 'Menú eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar menú:', error);
        showToast('error', 'Error al eliminar el menú. Por favor, intenta de nuevo.');
      }
    }
  };

  const goBackToConfig = () => {
    setMenuState('configure');
    setMenuOptions([]);
  };

  const handleRecipeSubmit = (data) => {
    // Evitar múltiples envíos
    if (isGeneratingRecipe) return;
    
    // Enviar datos al backend MCP para receta rápida
    (async () => {
      try {
        setIsGeneratingRecipe(true);
        const result = await import('../services/recipe.js').then(m => m.recipeService.generateQuickRecipe(data));
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
              <p className="text-sm text-slate-600">
                Escribe, graba un audio o sube una foto de tus ingredientes
              </p>
            </div>
            <RecipeInput 
              onSubmit={handleRecipeSubmit} 
              isGenerating={isGeneratingRecipe} 
            />
            <div className="mt-8 text-center text-xs text-slate-500 max-w-md">
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  IA Avanzada
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Recetas Personalizadas
                </div>
              </div>
              <p className="mt-4 text-slate-400">
                Puedes describir ingredientes por texto, grabar un audio o subir una foto. 
                                Tu NeveraApp generará recetas personalizadas para ti.
              </p>
            </div>
          </div>
        );
      case 'menu':
        return (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 min-h-screen">
            {menuState === 'loading' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">Cargando menú...</h2>
              </div>
            )}

            {menuState === 'configure' && (
              <MenuConfig 
                onSubmit={handleMenuConfigSubmit}
                isLoading={isMenuLoading}
              />
            )}

            {menuState === 'options' && (
              <MenuOptions
                options={menuOptions}
                onSelect={handleMenuOptionSelect}
                onGoBack={goBackToConfig}
                isLoading={isMenuLoading}
              />
            )}

            {menuState === 'saved' && savedMenu && (
              <MenuViewer
                menu={savedMenu}
                onEdit={handleMenuEdit}
                onDelete={handleMenuDelete}
              />
            )}
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
