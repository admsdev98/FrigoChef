import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { RecipeInput } from '../components/RecipeInput';

export function Dashboard({ user, onSignOut }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('main');

  const handleRecipeSubmit = (data) => {
    console.log('Recipe submission:', data);
    // Aquí implementarás la lógica para enviar al backend
    alert('Funcionalidad próximamente - Datos recibidos: ' + JSON.stringify(data, null, 2));
  };

  const renderMainContent = () => {
    switch (currentSection) {
      case 'main':
        return (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="text-center mb-8 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
                ¡Hola, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-lg text-slate-600 mb-2">
                ¿Qué tienes en tu nevera hoy?
              </p>
              <p className="text-sm text-slate-500">
                Escribe, graba un audio o sube una foto de tus ingredientes
              </p>
            </div>
            
            <RecipeInput onSubmit={handleRecipeSubmit} />
            
            <div className="mt-8 text-center text-xs text-slate-400 max-w-md">
              <p>
                Puedes describir ingredientes por texto, grabar un audio o subir una foto. 
                FrigoChef generará recetas personalizadas para ti.
              </p>
            </div>
          </div>
        );
        
      case 'recipes':
        return (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Mis Recetas</h2>
              <p className="text-slate-600 mb-6">
                Aquí aparecerán todas las recetas que hayas generado
              </p>
              <button
                onClick={() => setCurrentSection('main')}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Crear mi primera receta
              </button>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Configuración</h2>
              
              <div className="space-y-6">
                {/* Información de cuenta */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Cuenta</h3>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-800">{user?.email}</p>
                    <p className="text-xs text-slate-500 mt-1">Usuario verificado</p>
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
                    className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
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
    <div className="flex h-screen bg-slate-50">
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
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-slate-800">FrigoChef</h1>
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </div>
        
        {/* Contenido principal */}
        {renderMainContent()}
      </div>
    </div>
  );
}
