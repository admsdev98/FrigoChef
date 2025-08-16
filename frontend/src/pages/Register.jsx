import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pwd, confirmPwd) => {
    if (!pwd || pwd.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (pwd !== confirmPwd) return 'Las contraseñas no coinciden';
    return '';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok && data?.user) {
        navigate('/login');
      } else {
        setError(data?.detail || 'No se pudo registrar');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form className="bg-white p-6 rounded shadow w-80" onSubmit={handleRegister}>
        <h2 className="text-xl font-bold mb-4">Registro</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
        <input
          type="text"
          placeholder="Usuario"
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={username}
          onChange={e => setUsername(e.target.value)}
          minLength={3}
          maxLength={50}
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="email@ejemplo.com"
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <input
          type="password"
          placeholder="Mínimo 6 caracteres"
          className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
        <input
          type="password"
          placeholder="Repite la contraseña"
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          minLength={6}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Registrando…' : 'Registrar'}
        </button>

        {error && (
          <div className="mt-4 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative">
            <span className="flex-1">{error}</span>
            <button type="button" className="ml-2 text-red-700" onClick={() => setError('')}>
              ×
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default Register;
