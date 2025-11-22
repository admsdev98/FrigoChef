import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthForm } from '../modules/AuthForm';

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
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
      style={{ 
        animation: 'fadeIn 0.6s ease-out forwards',
        animationFillMode: 'both'
      }}
    >
      <div 
        className="max-w-md w-full"
        style={{ 
          animation: 'slideUp 0.8s ease-out 0.2s forwards',
          animationFillMode: 'both',
          opacity: 0,
          transform: 'translateY(20px)'
        }}
      >
        {/* Botón para volver a home */}
        <div 
          className="mb-8"
          style={{ 
            animation: 'slideInLeft 0.6s ease-out 0.4s forwards',
            animationFillMode: 'both',
            opacity: 0,
            transform: 'translateX(-20px)'
          }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">Volver al inicio</span>
          </Link>
        </div>
        
        {/* Formulario */}
        <div 
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
          style={{ 
            animation: 'formSlideIn 0.8s ease-out 0.6s forwards',
            animationFillMode: 'both',
            opacity: 0,
            transform: 'translateY(30px) scale(0.95)'
          }}
        >
          <AuthForm supabaseClient={supabaseClient} />
        </div>
      </div>
    </div>
  );
}
