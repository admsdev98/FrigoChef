import React from 'react';
import { useNavigate } from 'react-router-dom';

export function FAQPage() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const faqs = [
    {
      question: "¿Cómo funciona?",
      answer: "Agrega ingredientes escribiendo, grabando o tomando una foto. La IA genera recetas personalizadas al instante."
    },
    {
      question: "¿Es gratis?",
      answer: "Sí, FrigoChef es completamente gratuito para uso básico."
    },
    {
      question: "¿Guarda mis recetas?",
      answer: "Todas las recetas se guardan automáticamente en tu perfil para acceso posterior."
    },
    {
      question: "¿Funciona sin internet?",
      answer: "Las recetas guardadas están disponibles offline, pero necesitas conexión para generar nuevas."
    },
    {
      question: "¿Cómo cambio mis preferencias?",
      answer: "Ve a tu perfil y actualiza tus restricciones alimentarias cuando quieras."
    },
    {
      question: "¿Incluye información nutricional?",
      answer: "Sí, todas las recetas incluyen información básica de calorías y nutrientes."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            {/* Botón volver */}
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Volver</span>
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <span className="text-lg font-semibold text-emerald-700">FrigoChef</span>
            </div>

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

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12 animate-slideDown">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-600">
            Todo lo que necesitas saber sobre FrigoChef
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-sm transition-all duration-200 animate-slideUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-12 p-6 bg-emerald-50 rounded-lg animate-slideUp" style={{ animationDelay: '800ms' }}>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            ¿Listo para empezar?
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Crea tu primera receta en segundos
          </p>
          <button
            onClick={handleLoginClick}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Empezar ahora
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-300 text-sm">&copy; 2025 FrigoChef. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
