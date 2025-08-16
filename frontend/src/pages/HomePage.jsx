import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const [visibleCards, setVisibleCards] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const totalSections = 3;

  useEffect(() => {
    // Detectar si es desktop
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    // Observer para las tarjetas animadas
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.dataset.cardIndex);
            setVisibleCards(prev => [...new Set([...prev, cardIndex])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const cards = document.querySelectorAll('[data-card-index]');
    cards.forEach(card => observer.observe(card));

    // Control de scroll por secciones solo en desktop
    let isScrolling = false;

    const handleWheel = (e) => {
      if (!isDesktop || isScrolling || isNavigating) return;
      
      e.preventDefault();
      isScrolling = true;

      if (e.deltaY > 0) {
        // Scroll hacia abajo
        setCurrentSection(prev => Math.min(prev + 1, totalSections - 1));
      } else {
        // Scroll hacia arriba
        setCurrentSection(prev => Math.max(prev - 1, 0));
      }

      setTimeout(() => {
        isScrolling = false;
      }, 1000);
    };

    // Control de teclado (flechas) solo en desktop
    const handleKeyDown = (e) => {
      if (!isDesktop || isScrolling || isNavigating) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        isScrolling = true;
        setCurrentSection(prev => Math.min(prev + 1, totalSections - 1));
        setTimeout(() => { isScrolling = false; }, 1000);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        isScrolling = true;
        setCurrentSection(prev => Math.max(prev - 1, 0));
        setTimeout(() => { isScrolling = false; }, 1000);
      }
    };

    // Solo agregar listeners en desktop
    if (isDesktop) {
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkIsDesktop);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDesktop, isNavigating]);

  // Scroll automático a la sección actual solo en desktop
  useEffect(() => {
    if (!isDesktop) return;
    
    const section = document.getElementById(`section-${currentSection}`);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [currentSection, isDesktop]);

  // Manejar clics en botones de navegación
  const handleLoginClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNavigating(true);
    // Navegar a la página de login
    navigate('/login');
  };

  const features = [
    {
      title: "Escribe, Dicta o Fotografía",
      description: "Escribe, dicta por voz o haz una foto de los ingredientes de tu nevera o del ticket de la compra. FrigoChef los reconoce automáticamente.",
      icon: "📝"
    },
    {
      title: "Personaliza tu Menú",
      description: "Indica qué tipo de platos o menú quieres, especifica alergenos, tipo de cocina, tiempo disponible y preferencias dietéticas.",
      icon: "🎯"
    },
    {
      title: "Disfruta de tus Recetas",
      description: "Recibe ideas de recetas únicas y personalizadas paso a paso. Guarda tus favoritas y compártelas con quien quieras.",
      icon: "�️"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ${isDesktop ? 'section-scroll' : ''}`}>
      {/* Header con botón de login - responsive */}
      <header className="fixed top-0 right-0 z-50 p-4 sm:p-6">
        <button
          onClick={handleLoginClick}
          className="bg-emerald-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full hover:bg-emerald-700 transition-all shadow-lg text-sm sm:text-base"
        >
          Iniciar Sesión
        </button>
      </header>

      {/* Sección 1: Hero - responsive */}
      <section 
        id="section-0"
        className="min-h-screen flex items-center justify-center px-4 sm:px-6"
      >
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 mb-4 sm:mb-6">
            FrigoChef
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed px-4">
            Transforma los ingredientes de tu nevera en recetas extraordinarias con el poder de la inteligencia artificial. 
            Nunca más te quedarás sin ideas para cocinar.
          </p>
          {isDesktop && (
            <div className="animate-bounce cursor-pointer" onClick={() => setCurrentSection(1)}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          )}
          {!isDesktop && (
            <div className="mt-8">
              <button
                onClick={handleLoginClick}
                className="bg-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all shadow-xl"
              >
                Empezar Ahora
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sección 2: Características - responsive */}
      <section 
        id="section-1"
        className="min-h-screen flex items-center justify-center py-16 sm:py-20 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 mb-12 sm:mb-16 px-4">
            ¿Cómo funciona FrigoChef?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                data-card-index={index}
                className={`p-6 sm:p-8 text-center transform transition-all duration-1000 bg-white bg-opacity-60 rounded-xl shadow-sm ${
                  visibleCards.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">{feature.icon}</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección 3: Call to Action - responsive */}
      <section 
        id="section-2"
        className="min-h-screen flex items-center justify-center px-4 sm:px-6"
      >
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 sm:mb-6 px-4">
            ¿Listo para revolucionar tu cocina?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-12 leading-relaxed px-4">
            Únete a miles de usuarios que ya han descubierto el placer de cocinar 
            con ingredientes que tienen a mano. Empieza tu aventura culinaria hoy mismo.
          </p>
          <button
            onClick={handleLoginClick}
            className="bg-emerald-600 text-white px-8 py-3 sm:px-12 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-emerald-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Empezar mi Proyecto Culinario
          </button>
          <p className="text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6 px-4">
            Gratis • Sin compromisos • Resultados inmediatos
          </p>
        </div>
      </section>
    </div>
  );
}
