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
              Crea recetas rápidamente con los ingredientes que tienes en casa. Rapido, sencillo y directo al plato.
            </p>
          </div>

          <button
            onClick={handleLoginClick}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-emerald-700 transition-colors mb-6 btn-hover-lift animate-slideUp"
            style={{ animationDelay: '400ms' }}
          >
            Crear receta
          </button>
        </div>
      </section>

      {/* Cómo funciona */}
      <section ref={sectionRef} className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-12 animate-slideDown">
            Cómo funciona
          </h2>

          {/* Desktop version optimizada */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Paso 1 */}
              <div className={`text-center transition-all duration-800 ease-out ${visibleSteps.includes(0)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                }`}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-emerald-50 z-10 relative">
                    <span className="text-3xl font-bold text-emerald-600">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Agrega ingredientes
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Escribe, graba o toma foto de lo que tienes en casa
                </p>
              </div>

              {/* Paso 2 */}
              <div className={`text-center transition-all duration-800 ease-out ${visibleSteps.includes(1)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                }`}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-emerald-100 z-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600"></div>
                    <span className="text-3xl font-bold text-white relative z-10">2</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    Recibe recetas
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    IA Powered
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                  La IA genera opciones personalizadas en segundos
                </p>
              </div>

              {/* Paso 3 */}
              <div className={`text-center transition-all duration-800 ease-out ${visibleSteps.includes(2)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                }`}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-emerald-50 z-10 relative">
                    <span className="text-3xl font-bold text-emerald-600">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Cocina
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Sigue las instrucciones paso a paso y disfruta
                </p>
              </div>
            </div>
          </div>

          {/* Mobile version simplificada */}
          <div className="md:hidden space-y-8">
            {/* Paso 1 Mobile */}
            <div className="text-center animate-slideUp" style={{ animationDelay: '100ms' }}>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-emerald-50">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Agrega ingredientes
              </h3>
              <p className="text-gray-600 text-sm px-4">
                Escribe, graba o toma foto de lo que tienes en casa
              </p>
            </div>

            {/* Paso 2 Mobile */}
            <div className="text-center animate-slideUp" style={{ animationDelay: '200ms' }}>
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-emerald-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600"></div>
                <span className="text-2xl font-bold text-white relative z-10">2</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-800">
                  Recibe recetas
                </h3>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  IA
                </span>
              </div>
              <p className="text-gray-600 text-sm px-4">
                La IA genera opciones personalizadas en segundos
              </p>
            </div>

            {/* Paso 3 Mobile */}
            <div className="text-center animate-slideUp" style={{ animationDelay: '300ms' }}>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border-2 border-emerald-50">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Cocina
              </h3>
              <p className="text-gray-600 text-sm px-4">
                Sigue las instrucciones paso a paso y disfruta
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
