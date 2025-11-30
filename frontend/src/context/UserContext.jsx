import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/user.js';
import { adaptUserPreferences, adaptPreferencesPayload } from '../adapters/userAdapter.js';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [nutritionalPreferences, setNutritionalPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { isAuthenticated } = useAuth();

  // Cargar solo las preferencias nutricionales
  const loadUserData = useCallback(async (forceReload = false) => {
    // Solo cargar si se fuerza o es la primera vez
    if (!forceReload && hasLoaded) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Cargar perfil y preferencias en paralelo
      const [profileData, preferencesData] = await Promise.all([
        userService.getUserProfile().catch(() => null),
        userService.getNutritionalPreferences().catch(() => null)
      ]);

      setUserProfile(profileData);
      // Note: The backend returns the raw object, we might want to keep it raw or adapt it.
      // The NutritionProfile component expects raw keys like 'allergens', 'diet_type' etc.
      // But my adapter changes them to camelCase. 
      // Let's check NutritionProfile again. It expects: allergens, diet_type, preferred_foods...
      // So if I adapt it, I need to update NutritionProfile too.
      // OR I can update the adapter to match what NutritionProfile expects OR update NutritionProfile to use camelCase.
      // Given the instruction to "adapt information", I should probably use the adapter and update the component.
      // However, for MVP speed, if I change the keys now, I have to update NutritionProfile.jsx heavily.
      // Let's stick to what NutritionProfile expects for now to avoid breaking it, OR update NutritionProfile.

      // Wait, I already checked NutritionProfile.jsx. It uses:
      // setAllergens(nutritionalPreferences.allergens || []);
      // setDietType(nutritionalPreferences.diet_type || []);

      // My adapter:
      // dietaryRestrictions: backendPrefs.dietary_restrictions
      // allergies: backendPrefs.allergies

      // It seems my adapter uses different keys than what NutritionProfile expects.
      // 'diet_type' vs 'dietaryRestrictions'.

      // I will update the adapter to match the backend keys BUT return a clean object, 
      // OR I will update NutritionProfile to use the new keys.
      // Updating NutritionProfile is better for long term code quality (camelCase in frontend).

      // Let's use the adapter and I will update NutritionProfile in the next step.

      const adapted = adaptUserPreferences(preferencesData);
      setNutritionalPreferences(adapted);
    } catch (err) {
      console.error('Error cargando preferencias nutricionales:', err);
      setError(err);
    } finally {
      setHasLoaded(true);
      setLoading(false);
    }
  }, [hasLoaded]);

  // Cargar datos cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    } else {
      clearUserData();
    }
  }, [isAuthenticated, loadUserData]);

  // Actualizar solo las preferencias nutricionales
  const updateNutritionalPreferences = async (newPreferences) => {
    try {
      // newPreferences comes from NutritionProfile, likely in the format it uses internally.
      // If I update NutritionProfile to use camelCase, then newPreferences will be camelCase.
      // Then I use adaptPreferencesPayload to convert to snake_case for backend.

      // For now, let's assume I will update NutritionProfile.
      const payload = adaptPreferencesPayload(newPreferences);
      await userService.setNutritionalPreferences(payload);
      setNutritionalPreferences(newPreferences);
      return true;
    } catch (err) {
      console.error('Error actualizando preferencias:', err);
      setError(err);
      return false;
    }
  };

  // Actualizar perfil de usuario
  const updateUserProfile = async (data) => {
    try {
      await userService.updateUserProfile(data);
      // Actualizar estado local fusionando con lo existente
      setUserProfile(prev => ({ ...prev, ...data }));
      return true;
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      setError(err);
      return false;
    }
  };

  // Limpiar datos al cerrar sesión
  const clearUserData = () => {
    setUserProfile(null);
    setNutritionalPreferences(null);
    setError(null);
    setHasLoaded(false);
  };

  const value = {
    userProfile,
    nutritionalPreferences,
    loading,
    error,
    loadUserData,
    updateNutritionalPreferences,
    updateUserProfile,
    clearUserData,
    hasLoaded
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
