import { supabase } from './supabase.js';

export const authService = {
  // Obtener sesión actual
  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Cerrar sesión
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Login con email y password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, session: data.session, error };
  },

  // Registro con email y password
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { user: data.user, session: data.session, error };
  }
};
