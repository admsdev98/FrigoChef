import React, { useState } from 'react';

// Iconos SVG simples
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export function AuthForm({ supabaseClient }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleOAuthLogin = async (provider) => {
    try {
      setLoading(true);
      setError('');
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      if (isSignUp) {
        const { error } = await supabaseClient.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setError('¡Revisa tu email para confirmar tu cuenta!');
      } else {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Entrar a FrigoChef</h1>
        <p className="text-sm text-gray-600">
          Crea tu cuenta o inicia sesión
        </p>
      </div>

      {/* Botones OAuth */}
      <div className="space-y-3 mb-6">
        <button
          onClick={() => handleOAuthLogin('google')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GoogleIcon />
          <span className="text-sm font-medium text-gray-700">Continuar con Google</span>
        </button>

        <button
          onClick={() => handleOAuthLogin('github')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-900 rounded-lg transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <GitHubIcon />
          <span className="text-sm font-medium text-white">Continuar con GitHub</span>
        </button>

        <button
          onClick={() => handleOAuthLogin('linkedin_oidc')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-700 hover:bg-blue-600 border border-blue-700 rounded-lg transition-colors duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LinkedInIcon />
          <span className="text-sm font-medium text-white">Continuar con LinkedIn</span>
        </button>
      </div>

      {/* Divisor */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">O</span>
        </div>
      </div>

      {/* Formulario Email/Password */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="tu@email.com"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {error && (
          <div className={`text-sm p-3 rounded-lg ${error.includes('Revisa') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Cargando...' : isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
        </button>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          disabled={loading}
          className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
        >
          {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </form>
    </div>
  );
}
