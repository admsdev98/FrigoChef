import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { supabase } from './services/supabase';
import { UserProvider } from './context/UserContext.jsx';
import { RecipeProvider } from './context/RecipeContext.jsx';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

// Componente para proteger rutas
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Componente para rutas públicas (redirigir si ya está autenticado)
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  const { signOut } = useAuth();

  return (
    <UserProvider>
      <RecipeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage supabaseClient={supabase} />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage onSignOut={signOut} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </RecipeProvider>
    </UserProvider>
  );
}

export default App;
