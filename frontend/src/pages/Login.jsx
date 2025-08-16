import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: username, password: password })
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        document.cookie = `session=${data.access_token}; path=/`;
        navigate('/dashboard');
      } else {
        setError(data.detail || 'Credenciales incorrectas');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form className="bg-white p-6 rounded shadow w-80" onSubmit={handleLogin}>
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Email o usuario"
          className="w-full mb-2 px-3 py-2 border rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full mb-4 px-3 py-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Entrar</button>
        {error && (
          <div className="mt-4 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative">
            <span className="flex-1">
              {Array.isArray(error)
                ? error.map((err, idx) => <div key={idx}>{err.msg || JSON.stringify(err)}</div>)
                : typeof error === 'object'
                  ? error.msg || JSON.stringify(error)
                  : error}
            </span>
            <button type="button" className="ml-2 text-red-700" onClick={() => setError('')}>×</button>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
