import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoSrc from '../media/main_logo_without_background.png';

export function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleFAQClick = () => {
    navigate('/faq');
  };

  return (
    <div className="bg-white">
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
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm"
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
              className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-8"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              De tu nevera a tu plato
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Crea recetas personalizadas con los ingredientes que tienes en casa
            </p>
          </div>

          <button
            onClick={handleLoginClick}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-emerald-700 transition-colors mb-6"
          >
            Crear receta
          </button>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-12">
            Cómo funciona
          </h2>

          <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8">
            {/* Paso 1 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Agrega ingredientes
              </h3>
              <p className="text-gray-600">
                Escribe, graba o toma foto de lo que tienes
              </p>
            </div>

            {/* Paso 2 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Recibe recetas
              </h3>
              <p className="text-gray-600">
                La IA genera opciones personalizadas
              </p>
            </div>

            {/* Paso 3 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Cocina
              </h3>
              <p className="text-gray-600">
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
