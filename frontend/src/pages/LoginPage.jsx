import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../modules/LoginForm';

export function LoginPage({ supabaseClient }) {
  const containerRef = useRef(null);

  // Evitar que las animaciones se reinicien cuando el componente se re-renderiza
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.animationPlayState = 'running';
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        animation: 'fadeIn 0.3s ease-out forwards',
        animationFillMode: 'both'
      }}
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div
        className="max-w-md w-full relative z-10"
        style={{
          animation: 'slideUp 0.4s ease-out 0.1s forwards',
          animationFillMode: 'both',
          opacity: 0,
          transform: 'translateY(20px)'
        }}
      >
        {/* Botón para volver a home */}
        <div
          className="mb-8"
          style={{
            animation: 'slideInLeft 0.3s ease-out 0.2s forwards',
            animationFillMode: 'both',
            opacity: 0,
            transform: 'translateX(-20px)'
          }}
        >
          <Link
            to="/"
            className="inline-flex items-center text-emerald-800 hover:text-emerald-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">Volver al inicio</span>
          </Link>
        </div>

        {/* Formulario */}
        <div
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8 sm:p-10"
          style={{
            animation: 'formSlideIn 0.4s ease-out 0.2s forwards',
            animationFillMode: 'both',
            opacity: 0,
            transform: 'translateY(30px) scale(0.95)'
          }}
        >
          <LoginForm supabaseClient={supabaseClient} />
        </div>
      </div>
    </div>
  );
}
