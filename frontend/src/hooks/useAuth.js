import { useState, useEffect, useRef } from 'react';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const previousSessionRef = useRef(null);

  useEffect(() => {
    // Obtener sesión inicial
    authService.getCurrentSession().then(({ session }) => {
      setSession(session);
      previousSessionRef.current = session;
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      // Evitar actualizaciones innecesarias si la sesión no ha cambiado realmente
      if (previousSessionRef.current !== session) {
        setSession(session);
        previousSessionRef.current = session;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await authService.signOut();
  };

  return {
    session,
    loading,
    signOut,
    isAuthenticated: !!session
  };
};
