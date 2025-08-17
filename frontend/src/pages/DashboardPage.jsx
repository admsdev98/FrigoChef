import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../context/UserContext.jsx';
import { useRecipes } from '../context/RecipeContext.jsx';
import { Dashboard } from '../modules/Dashboard';

export function DashboardPage({ onSignOut }) {
  const { session } = useAuth();
  const { loadUserData, clearUserData } = useUser();
  const { clearRecipeData } = useRecipes();
  const navigate = useNavigate();

  // Cargar datos del usuario al entrar al dashboard
  useEffect(() => {
    if (session?.user) {
      loadUserData(true); // Forzar carga inicial
    }
  }, [session?.user, loadUserData]);

  const handleSignOut = async () => {
    clearUserData(); // Limpiar caché del usuario
    clearRecipeData(); // Limpiar caché de recetas
    await onSignOut();
    navigate('/');
  };

  return (
    <Dashboard user={session?.user} onSignOut={handleSignOut} />
  );
}
