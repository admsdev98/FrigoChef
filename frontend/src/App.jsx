import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { supabase } from './services/supabase';
import { UserProvider, useUser } from './context/UserContext.jsx';
import { RecipeProvider } from './context/RecipeContext.jsx';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardHome } from './pages/DashboardHome';
import { MenuPage } from './pages/MenuPage';
import { SettingsPage } from './pages/SettingsPage';
import NutritionProfile from './pages/NutritionProfile';
import Profile from './pages/Profile';
import { FAQPage } from './pages/FAQPage';

// Componente para proteger rutas
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { userProfile, loading: userLoading, hasLoaded } = useUser();

  if (authLoading || (isAuthenticated && !hasLoaded)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
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

  // Si está autenticado, redirigir inmediatamente sin mostrar el componente
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <UserProvider>
      <RecipeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage supabaseClient={supabase} />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage supabaseClient={supabase} />
                </PublicRoute>
              }
            />

            {/* Rutas protegidas del Dashboard */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/create-quick-recipe" element={<DashboardHome />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route
                path="/nutrition"
                element={
                  <NutritionProfile
                    onSave={(data) => console.log('Preferencias guardadas:', data)}
                  />
                }
              />
            </Route>

            {/* Redirección por defecto para rutas desconocidas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </RecipeProvider>
    </UserProvider>
  );
}

export default App;
