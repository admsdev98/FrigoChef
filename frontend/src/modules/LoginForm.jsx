import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { OAuthButton, Divider } from '../components/OAuthButton';

export function LoginForm({ supabaseClient }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');

            const { error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 tracking-tight">Bienvenido de nuevo</h1>
            </div>

            {/* Botones OAuth */}
            <div className="space-y-3 mb-6">
                <OAuthButton
                    provider="google"
                    onClick={() => handleOAuthLogin('google')}
                    disabled={loading}
                />
                <OAuthButton
                    provider="github"
                    onClick={() => handleOAuthLogin('github')}
                    disabled={loading}
                />
                {/* LinkedIn can be added if needed, sticking to main ones for cleaner UI or all if preferred. Keeping all for parity with old form */}
                <OAuthButton
                    provider="linkedin_oidc"
                    onClick={() => handleOAuthLogin('linkedin_oidc')}
                    disabled={loading}
                />
            </div>

            <Divider text="O continúa con email" />

            {/* Formulario Email/Password */}
            <form onSubmit={handleEmailLogin} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Correo electrónico
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
                        placeholder="nombre@ejemplo.com"
                        disabled={loading}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" class="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
                        placeholder="••••••••"
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Iniciando sesión...
                        </span>
                    ) : 'Iniciar sesión'}
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                        Regístrate gratis
                    </Link>
                </p>
            </form>
        </div>
    );
}
