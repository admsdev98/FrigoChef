import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSrc from '../media/main_logo_without_background.png';

export function HomePage() {
  const navigate = useNavigate();
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  useEffect(() => {
    // Observer para las animaciones escalonadas
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.dataset.stepIndex);
            if (!isNaN(stepIndex)) {
              // Animar los pasos uno por uno con delay
              setTimeout(() => {
                setVisibleSteps(prev => [...new Set([...prev, stepIndex])]);
              }, stepIndex * 200);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const steps = document.querySelectorAll('[data-step-index]');
    steps.forEach(step => observer.observe(step));

    return () => {
      observer.disconnect();
    };
  }, []);

  // Cerrar menú móvil al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('header')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  const handleLoginClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNavigating(true);
    navigate('/login');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // altura del header fijo
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const handleFAQClick = () => {
    setMobileMenuOpen(false);
    navigate('/faq');
  };

  const handlePricingClick = () => {
    setMobileMenuOpen(false);
    const element = document.querySelector('.pricing-section');
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white">
      {/* Header fijo */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-emerald-900">Tu NeverApp</span>
            </div>
            
            {/* Navegación central - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={handleFAQClick}
                className="text-slate-700 hover:text-emerald-600 font-medium transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={handlePricingClick}
                className="text-slate-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Pricing
              </button>
            </nav>
            
            {/* Botones derecha */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLoginClick}
                className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-sm text-sm font-medium"
              >
                Iniciar Sesión
              </button>
              
              {/* Menú hamburguesa - Solo móvil */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-700 hover:text-emerald-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Menú desplegable móvil */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
              <nav className="px-4 py-4 space-y-2">
                <button
                  onClick={handleFAQClick}
                  className="block w-full text-left text-slate-700 hover:text-emerald-600 font-medium py-2 transition-colors"
                >
                  FAQ
                </button>
                <button
                  onClick={handlePricingClick}
                  className="block w-full text-left text-slate-700 hover:text-emerald-600 font-medium py-2 transition-colors"
                >
                  Pricing
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Sección 1: Hero Principal */}
      <section 
        className="min-h-screen flex items-center justify-center pt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            {/* Contenido principal */}
            <div className="text-center lg:text-left mb-12 lg:mb-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-emerald-900 mb-6 leading-tight">
                Directo de tu nevera
                <span className="text-emerald-600 block">a tu plato</span>
              </h1>
              
              <p className="text-xl text-emerald-700 mb-8 leading-relaxed max-w-2xl">
                Usamos inteligencia artificial para analizar y crear platos o menús a medida, de manera 
                rapida y sencilla.
              </p>

              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center lg:justify-start">
                <button
                  onClick={handleLoginClick}
                  className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Crear mi primera receta
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-8 text-sm text-slate-500">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Primeros 5 platos gratis
                </div>
              </div>
            </div>

            {/* Logo del proyecto - Solo desktop */}
            <div className="hidden lg:block lg:ml-8">
              <div className="relative flex items-center justify-center min-h-[500px]">
                <div className="text-center">
                  <img 
                    src={logoSrc} 
                    alt="FrigoChef Logo" 
                    className="w-[32rem] h-[32rem] mx-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Cómo Funciona - Pasos */}
      <section 
        className="py-20 bg-slate-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Mas rápido que cocinar un huevo
            </h2>
          </div>

          {/* Desktop: 3 columnas */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-12 max-w-5xl mx-auto">
            {/* Paso 1 */}
            <div 
              data-step-index="0"
              className={`text-center transition-all duration-1000 ${
                visibleSteps.includes(0) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Dinos qué tienes
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  Escribe, graba o fotografía los ingredientes que tienes en casa
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div 
              data-step-index="1"
              className={`text-center transition-all duration-1000 ${
                visibleSteps.includes(1) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  IA genera opciones
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  Nuestra inteligencia artificial crea recetas personalizadas al instante
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div 
              data-step-index="2"
              className={`text-center transition-all duration-1000 ${
                visibleSteps.includes(2) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Cocina y disfruta
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  Sigue las instrucciones paso a paso y sorprende con platos increíbles
                </p>
              </div>
            </div>
          </div>

          {/* Mobile: Stack vertical */}
          <div className="lg:hidden space-y-12 max-w-lg mx-auto">
            {/* Paso 1 Mobile */}
            <div 
              data-step-index="0"
              className={`text-center transition-all duration-1000 ${
                visibleSteps.includes(0) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Dinos qué tienes
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  Escribe, graba o fotografía los ingredientes que tienes en casa
                </p>
              </div>
            </div>

            {/* Paso 2 Mobile */}
            <div 
              data-step-index="1"
              className={`text-center transition-all duration-1000 ${
                visibleSteps.includes(1) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  IA genera opciones
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  Nuestra inteligencia artificial crea recetas personalizadas al instante
                </p>
              </div>
            </div>

            {/* Paso 3 Mobile */}
            <div 
              data-step-index="2"
              className={`text-center transition-all duration-1000 ${
                visibleSteps.includes(2) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              <div className="relative">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Cocina y disfruta
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  Sigue las instrucciones paso a paso y sorprende con platos increíbles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección FAQ */}
      {showFAQ && (
        <section id="faq-section" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Preguntas Frecuentes
              </h2>
              <p className="text-xl text-slate-600">
                Todo lo que necesitas saber sobre FrigoChef
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: "¿Cómo funciona el reconocimiento de ingredientes?",
                  answer: "Nuestra IA puede procesar texto, audio o imágenes. Simplemente describe, graba o fotografía tus ingredientes y automáticamente los identificaremos para crear recetas personalizadas."
                },
                {
                  question: "¿Las recetas se adaptan a mis restricciones alimentarias?",
                  answer: "Sí, puedes configurar tu perfil nutricional con alergias, intolerancias y preferencias dietéticas. Todas las recetas generadas respetarán estas restricciones."
                },
                {
                  question: "¿Cuántas recetas puedo generar al día?",
                  answer: "Con la cuenta gratuita puedes generar hasta 5 recetas por día. Con FrigoChef Pro tendrás acceso ilimitado a recetas y funcionalidades avanzadas."
                },
                {
                  question: "¿Puedo guardar mis recetas favoritas?",
                  answer: "Absolutamente. Todas las recetas que generes se guardan automáticamente en tu perfil, y puedes marcar tus favoritas para acceso rápido."
                },
                {
                  question: "¿Funciona sin conexión a internet?",
                  answer: "Las recetas guardadas están disponibles offline, pero necesitas conexión para generar nuevas recetas ya que utilizamos IA en la nube para crear contenido personalizado."
                },
                {
                  question: "¿Hay planes de suscripción?",
                  answer: "Estamos trabajando en ofrecer planes premium con funcionalidades extra como menús semanales, listas de compra inteligentes y análisis nutricional avanzado."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-colors">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-slate-600 mb-4">
                ¿No encuentras la respuesta que buscas?
              </p>
              <button
                onClick={handleLoginClick}
                className="bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-all font-medium"
              >
                Contáctanos
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Sección Pricing */}
      {false && (
        <section id="pricing-section" className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Planes y Precios
              </h2>
              <p className="text-xl text-slate-600">
                Elige el plan que mejor se adapte a tus necesidades culinarias
              </p>
            </div>

            {/* Contenedor con overlay difuminado */}
            <div className="relative">
              {/* Contenido de pricing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto filter blur-sm">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 relative">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Empezar Gratis</h3>
                    <p className="text-slate-600 mb-6">Perfecto para probar FrigoChef</p>
                    <div className="text-4xl font-bold text-slate-900">€0</div>
                    <div className="text-slate-500">para siempre</div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">5 recetas por día</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">Reconocimiento de ingredientes por texto</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">Historial de recetas</span>
                    </li>
                  </ul>

                  <button className="w-full bg-slate-100 text-slate-800 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-all">
                    Comenzar gratis
                  </button>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl text-white p-8 relative transform lg:scale-105">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Más Popular
                    </span>
                  </div>

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">FrigoChef Pro</h3>
                    <p className="text-emerald-100 mb-6">Para cocinar sin límites</p>
                    <div className="text-4xl font-bold">€9.99</div>
                    <div className="text-emerald-200">/mes</div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-emerald-100 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-emerald-50">Recetas ilimitadas</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-emerald-100 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-emerald-50">Reconocimiento por voz e imagen</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-emerald-100 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-emerald-50">Menús semanales personalizados</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-emerald-100 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-emerald-50">Análisis nutricional detallado</span>
                    </li>
                  </ul>

                  <button className="w-full bg-white text-emerald-700 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all">
                    Probar 7 días gratis
                  </button>
                </div>
              </div>

              {/* Overlay con mensaje */}
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="text-center max-w-md mx-auto p-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    ¡Próximamente!
                  </h3>
                  <p className="text-lg text-slate-600 mb-6">
                    Estamos trabajando en ofrecer planes para funcionalidades extra
                  </p>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                    <input
                      type="email"
                      placeholder="Déjanos tu email para notificarte cuando esté listo"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                    <button className="w-full mt-3 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                      Notificarme
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sección 3: Call to Action */}
      <section 
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero de la sección */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6">
              Comienza a disfrutar de una cocina más fácil y rápida
              <span className="text-emerald-600 block">hoy mismo</span>
            </h2>
          </div>

          {/* Pricing integrado */}
          <div className="mb-16 pricing-section">
              {/* Contenedor con overlay difuminado */}
              <div className="relative">
                {/* Contenido de pricing */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto filter blur-sm">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 relative">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Empezar Gratis</h3>
                      <p className="text-slate-600 mb-6">Perfecto para probar FrigoChef</p>
                      <div className="text-4xl font-bold text-slate-900">€0</div>
                      <div className="text-slate-500">para siempre</div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700">5 recetas por día</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700">Reconocimiento de ingredientes por texto</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700">Historial de recetas</span>
                      </li>
                    </ul>

                    <button className="w-full bg-slate-100 text-slate-800 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-all">
                      Comenzar gratis
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-xl text-white p-8 relative transform lg:scale-105">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Más Popular
                      </span>
                    </div>

                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">FrigoChef Pro</h3>
                      <p className="text-emerald-100 mb-6">Para cocinar sin límites</p>
                      <div className="text-4xl font-bold">€9.99</div>
                      <div className="text-emerald-200">/mes</div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-emerald-100 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-emerald-50">Recetas ilimitadas</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-emerald-100 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-emerald-50">Reconocimiento por voz e imagen</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-emerald-100 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-emerald-50">Menús semanales personalizados</span>
                      </li>
                      <li className="flex items-center">
                        <svg className="w-5 h-5 text-emerald-100 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-emerald-50">Análisis nutricional detallado</span>
                      </li>
                    </ul>

                    <button className="w-full bg-white text-emerald-700 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all">
                      Probar 7 días gratis
                    </button>
                  </div>
                </div>

                {/* Overlay con mensaje */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      ¡Próximamente!
                    </h3>
                    <p className="text-lg text-slate-600 mb-6">
                      Estamos trabajando en ofrecer planes para funcionalidades extra
                    </p>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                      <input
                        type="email"
                        placeholder="Déjanos tu email para notificarte cuando esté listo"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                      <button className="w-full mt-3 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                        Notificarme
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* CTA Principal */}
          <div className="text-center mb-16">
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                onClick={handleLoginClick}
                className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Crear mi cuenta gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-emerald-100">
            <p>&copy; 2025 Tu NeverApp. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
