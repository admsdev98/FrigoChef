import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md animate-slideUp"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
      >
        <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div
        className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-48 opacity-100 pb-6' : 'max-h-0 opacity-0'
          }`}
      >
        <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

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
      question: "¿Que es Tu NeveraAPP?",
      answer: "Tu NeveraAPP es una herramienta que te ayuda a crear recetas rápidamente con los ingredientes que tienes en casa. Facil, rapido y sin complicaciones."
    },
    {
      question: "¿Es gratis?",
      answer: "Sí, Tu NeveraAPP es completamente gratuito. Tan solo es un proyecto personal en el que pongo en practica lo que aprendo."
    },
    {
      question: "¿Que hacéis con la información personal?",
      answer: "No hacemos nada. Tan solo necesitamos tu correo o una de las cuentas de autenticación disponibles para iniciar sesión, usando la menor información personal posible."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn flex flex-col">
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
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Hero */}
        <div className="text-center mb-12 animate-slideDown">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-gray-600">
            Todo lo que necesitas saber sobre FrigoChef
          </p>
        </div>

        {/* FAQ Items Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-12 p-6 bg-white border border-gray-200 shadow-sm rounded-xl animate-slideUp" style={{ animationDelay: '800ms' }}>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            ¿Sigues teniendo curiosidad?
          </h3>
          <button
            onClick={handleLoginClick}
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Crea tu primera receta!
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-300 text-sm">&copy; 2025 FrigoChef. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
