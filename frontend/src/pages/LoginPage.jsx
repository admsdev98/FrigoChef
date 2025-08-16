import React from 'react';
import { Link } from 'react-router-dom';
import { AuthForm } from '../modules/AuthForm';

export function LoginPage({ supabaseClient }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Panel izquierdo - Formulario de autenticación */}
      <div className="flex-1 flex flex-col p-4 sm:p-8 lg:p-12">
        {/* Botón para volver a home */}
        <div className="mb-6 sm:mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm sm:text-base">Volver al inicio</span>
          </Link>
        </div>
        
        {/* Formulario centrado */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <AuthForm supabaseClient={supabaseClient} />
          </div>
        </div>
      </div>

      {/* Panel derecho - Información (solo visible en pantallas grandes) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-200 via-teal-200 to-cyan-200 items-center justify-center p-8 lg:p-12">
        <div className="max-w-md text-slate-700">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-slate-800">¡Bienvenido a FrigoChef!</h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              La forma más inteligente de aprovechar los ingredientes de tu cocina
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-6 h-6 bg-emerald-300 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                <svg className="w-3 h-3 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-800">Regístrate para empezar</h3>
                <p className="text-slate-600">Crea tu cuenta y comienza a generar recetas personalizadas</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-6 h-6 bg-emerald-300 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                <svg className="w-3 h-3 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-800">Completamente gratis</h3>
                <p className="text-slate-600">Sin costos ocultos, sin suscripciones. Solo recetas deliciosas</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-6 h-6 bg-emerald-300 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                <svg className="w-3 h-3 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-800">Recetas inteligentes</h3>
                <p className="text-slate-600">IA que entiende tus ingredientes y preferencias culinarias</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-6 h-6 bg-emerald-300 bg-opacity-60 rounded-full flex items-center justify-center mt-1">
                <svg className="w-3 h-3 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-slate-800">Reduce el desperdicio</h3>
                <p className="text-slate-600">Aprovecha al máximo los ingredientes que ya tienes en casa</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-400 border-opacity-30">
            <p className="text-sm text-slate-600 text-center">
              Únete a miles de usuarios que ya cocinan de forma más inteligente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
