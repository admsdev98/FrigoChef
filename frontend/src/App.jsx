import React from 'react';
import { useNavigate } from 'react-router-dom';
function App() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-2">FrigoChef</h1>
      <p className="mb-6 text-gray-700">Genera recetas personalizadas según los ingredientes que tienes disponibles.</p>
      <div className="flex gap-4">
        <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => navigate('/login')}>Login</button>
        <button className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => navigate('/register')}>Registrar</button>
      </div>
    </div>
  );
}

export default App;
