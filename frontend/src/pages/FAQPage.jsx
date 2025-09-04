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
    },
    {
      question: "¿Cómo puedo cambiar mis preferencias dietéticas?",
      answer: "Desde tu perfil de usuario puedes actualizar tus restricciones alimentarias, alergias y preferencias en cualquier momento. Los cambios se aplicarán inmediatamente a las nuevas recetas."
    },
    {
      question: "¿Las recetas incluyen información nutricional?",
      answer: "Sí, todas las recetas incluyen información básica de calorías y macronutrientes. Los usuarios Pro tienen acceso a análisis nutricional detallado y recomendaciones personalizadas."
    },
    {
      question: "¿Puedo compartir mis recetas con otros usuarios?",
      answer: "Puedes compartir tus recetas favoritas a través de enlaces directos o redes sociales. También estamos trabajando en una función de comunidad para intercambiar recetas entre usuarios."
    },
    {
      question: "¿Qué hago si una receta no me sale bien?",
      answer: "Puedes usar nuestro sistema de feedback para reportar problemas con las recetas. Esto nos ayuda a mejorar continuamente nuestros algoritmos de generación de recetas."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Botón volver */}
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Volver</span>
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-emerald-900">Tu NeverApp</span>
            </div>

            {/* Botón login */}
            <button
              onClick={handleLoginClick}
              className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-sm text-sm font-medium"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Todo lo que necesitas saber sobre FrigoChef. Si no encuentras la respuesta que buscas, 
            no dudes en contactarnos.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {faq.question}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            ¿Listo para empezar a cocinar?
          </h3>
          <p className="text-slate-600 mb-6">
            Únete a miles de usuarios que ya están disfrutando de FrigoChef
          </p>
          <button
            onClick={handleLoginClick}
            className="bg-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Crear mi cuenta gratis
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-900 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-emerald-100">
            <p>&copy; 2025 Tu NeverApp. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
