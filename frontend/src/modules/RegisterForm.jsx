
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { OAuthButton, Divider } from '../components/OAuthButton';

export function RegisterForm({ supabaseClient }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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

    const validatePassword = (pass, confirmPass) => {
        if (pass.length < 6) return "La contraseña debe tener al menos 6 caracteres";
        if (pass !== confirmPass) return "Las contraseñas no coinciden";
        // Add more rules if needed, e.g. numbers, special chars
        return null;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const passError = validatePassword(password, confirmPassword);
        if (passError) {
            setError(passError);
            return;
        }

        try {
            setLoading(true);
            setError('');

            const { error } = await supabaseClient.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username,
                    }
                }
            });
            if (error) throw error;
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Verifica tu correo!</h2>
                <p className="text-gray-600 mb-8">
                    Hemos enviado un enlace de confirmación a <span className="font-medium text-gray-900">{email}</span>.
                    Por favor, revisa tu bandeja de entrada para activar tu cuenta.
                </p>
                <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-colors"
                >
                    Volver al inicio de sesión
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 tracking-tight">Crea tu cuenta</h1>
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
            </div>

            <Divider text="O regístrate con email" />

            {/* Formulario Registro */}
            <form onSubmit={handleRegister} className="space-y-5">

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nombre de usuario
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
                        placeholder="usuario"
                        disabled={loading}
                    />
                </div>

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
                    <label htmlFor="password" class="block text-sm font-medium text-gray-700 mb-1.5">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
                        placeholder="Mínimo 6 caracteres"
                        disabled={loading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Debe tener al menos 6 caracteres.
                    </p>
                </div>

                <div>
                    <label htmlFor="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1.5">
                        Confirmar contraseña
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
                        placeholder="Repite tu contraseña"
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
                            Creando cuenta...
                        </span>
                    ) : 'Crear cuenta'}
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}
