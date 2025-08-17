import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService } from '../services/user.js';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [nutritionalPreferences, setNutritionalPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Cargar solo las preferencias nutricionales
  const loadUserData = useCallback(async (forceReload = false) => {
    // Solo cargar si se fuerza o es la primera vez
    if (!forceReload && hasLoaded) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Solo cargar preferencias nutricionales
      const preferencesData = await userService.getNutritionalPreferences().catch(() => null);
      
      setNutritionalPreferences(preferencesData);
      setHasLoaded(true);
    } catch (err) {
      console.error('Error cargando preferencias nutricionales:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [hasLoaded]); // Solo depende de hasLoaded

  // Actualizar solo las preferencias nutricionales
  const updateNutritionalPreferences = async (newPreferences) => {
    try {
      await userService.setNutritionalPreferences(newPreferences);
      setNutritionalPreferences(newPreferences);
      return true;
    } catch (err) {
      console.error('Error actualizando preferencias:', err);
      setError(err);
      return false;
    }
  };

  // Limpiar datos al cerrar sesión
  const clearUserData = () => {
    setNutritionalPreferences(null);
    setError(null);
    setHasLoaded(false);
  };

  const value = {
    userProfile: null, // Mantener por compatibilidad pero siempre null
    nutritionalPreferences,
    loading,
    error,
    loadUserData,
    updateNutritionalPreferences,
    clearUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider');
  }
  return context;
}
