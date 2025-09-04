import React from 'react';

export function Sidebar({ isOpen, onClose, user, onSignOut, currentSection, setCurrentSection }) {
  const menuItems = [
    {
      id: 'main',
      label: 'Receta rápida',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      id: 'dishes',
      label: 'Mis comidas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'menu',
      label: 'Mi menú semanal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    },
    {
      id: 'nutrition',
      label: 'Mi perfil nutricional',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 text-white z-50 transform transition-transform duration-300 ease-in-out backdrop-blur-lg
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:transform-none
      `}>
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 -left-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
            <div className="absolute top-40 -right-8 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-4 w-20 h-20 bg-emerald-600/10 rounded-full blur-xl"></div>
          </div>
          
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="/src/media/main_logo_without_background.png" 
                  alt="Tu NeveraApp" 
                  className="w-8 h-8"
                />
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">Tu NeveraApp</h1>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="relative flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item, idx) => {
              const isMenuDisabled = item.id === 'menu';
              
              if (isMenuDisabled) {
                // Diseño especial para "Mi menú semanal"
                return (
                  <div key={item.id} className="relative">
                    {/* Texto "Próximamente" arriba */}                    
                    <div className="text-center mb-2">
                      <span className="text-xs text-amber-300 font-medium bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30 backdrop-blur-sm">
                        Próximamente
                      </span>
                    </div>
                    {/* Botón deshabilitado */}
                    <button
                      disabled
                      className="w-full flex items-center space-x-3 px-4 py-3 text-white/40 cursor-not-allowed bg-white/5 rounded-xl border border-white/10"
                    >
                      {/* Candado amarillo */}
                      <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
                      </svg>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </div>
                );
              }
              
                            // Diseño normal para otros elementos
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id);
                    onClose(); // Cerrar sidebar en mobile
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group
                    ${currentSection === item.id
                      ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 text-white shadow-lg border border-emerald-400/30 backdrop-blur-sm' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/20'
                    }
                    ${idx === 0 ? 'font-semibold' : ''}
                  `}
                >
                  <span className={`transition-transform duration-200 ${currentSection === item.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {currentSection === item.id && (
                    <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full shadow-lg"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout y Configuración reducidos */}
          <div className="relative p-4 border-t border-white/10 flex flex-row gap-2 justify-between items-center">
            <button
              onClick={onSignOut}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm border border-transparent hover:border-red-400/30"
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <button
              onClick={() => {
                setCurrentSection('settings');
                onClose(); // Cerrar sidebar en mobile
              }}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm border ${
                currentSection === 'settings'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 text-white border-emerald-400/30'
                  : 'text-white/80 hover:bg-white/10 hover:text-white border-transparent hover:border-white/20'
              }`}
              title="Configuración"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
