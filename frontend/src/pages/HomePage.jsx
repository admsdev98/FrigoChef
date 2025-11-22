import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSrc from '../media/main_logo_without_background.png';

export function HomePage() {
  const navigate = useNavigate();
  const [visibleSteps, setVisibleSteps] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Mostrar pasos progresivamente cuando la sección es visible
          setTimeout(() => setVisibleSteps(prev => [...prev, 0]), 200);
          setTimeout(() => setVisibleSteps(prev => [...prev, 1]), 600);
          setTimeout(() => setVisibleSteps(prev => [...prev, 2]), 1000);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleFAQClick = () => {
    navigate('/faq');
  };

  return (
    <div className="bg-white animate-fadeIn">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-lg font-semibold text-emerald-700">FrigoChef</span>
            </div>
            
            {/* Navegación - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={handleFAQClick}
                className="text-gray-600 hover:text-emerald-600 text-sm transition-colors"
              >
                FAQ
              </button>
            </nav>
            
            {/* Botón login */}
            <button
              onClick={handleLoginClick}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm btn-hover-lift"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Principal */}
      <section className="min-h-screen flex items-center pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-8">
            <img 
              src={logoSrc} 
              alt="FrigoChef Logo" 
              className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8 animate-scaleIn"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 animate-slideDown">
              De tu nevera a tu plato
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '200ms' }}>
              Crea recetas personalizadas con los ingredientes que tienes en casa
            </p>
          </div>

          <button
            onClick={handleLoginClick}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-emerald-700 transition-colors mb-6 btn-hover-lift animate-slideUp"
            style={{ animationDelay: '400ms' }}
          >
            Crear receta
          </button>

          <p className="text-sm text-gray-500 animate-slideUp" style={{ animationDelay: '600ms' }}>
            Gratis para empezar
          </p>
        </div>
      </section>

      {/* Cómo funciona */}
      <section ref={sectionRef} className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-8 md:mb-12 animate-slideDown">
            Cómo funciona
          </h2>

          {/* Desktop version optimizada */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Paso 1 */}
              <div className={`text-center transition-all duration-800 ease-out ${
                visibleSteps.includes(0) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}>
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-700 font-bold text-xs">1</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Agrega ingredientes
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Escribe, graba o toma foto de lo que tienes en casa
                </p>
              </div>

              {/* Paso 2 */}
              <div className={`text-center transition-all duration-800 ease-out ${
                visibleSteps.includes(1) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}>
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-700 font-bold text-xs">2</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Recibe recetas
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  La IA genera opciones personalizadas en segundos
                </p>
                <div className="mt-2 flex justify-center">
                  <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    IA Powered
                  </div>
                </div>
              </div>

              {/* Paso 3 */}
              <div className={`text-center transition-all duration-800 ease-out ${
                visibleSteps.includes(2) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}>
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-700 font-bold text-xs">3</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Cocina
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sigue las instrucciones paso a paso y disfruta
                </p>
              </div>
            </div>
          </div>

          {/* Mobile version simplificada */}
          <div className="md:hidden space-y-6">
            {/* Paso 1 Mobile */}
            <div className="text-center animate-slideUp" style={{ animationDelay: '100ms' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Agrega ingredientes
              </h3>
              <p className="text-gray-600 text-sm">
                Escribe, graba o toma foto de lo que tienes
              </p>
            </div>

            {/* Paso 2 Mobile */}
            <div className="text-center animate-slideUp" style={{ animationDelay: '200ms' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Recibe recetas
              </h3>
              <p className="text-gray-600 text-sm">
                La IA genera opciones personalizadas
              </p>
            </div>

            {/* Paso 3 Mobile */}
            <div className="text-center animate-slideUp" style={{ animationDelay: '300ms' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Cocina
              </h3>
              <p className="text-gray-600 text-sm">
                Sigue las instrucciones paso a paso
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-300">&copy; 2025 FrigoChef. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
