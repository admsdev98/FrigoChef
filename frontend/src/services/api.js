import { supabase } from './supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Servicio base para realizar llamadas autenticadas al backend
 */
class ApiService {
  async makeAuthenticatedRequest(endpoint, options = {}) {
    // Obtener la sesión actual de Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('Usuario no autenticado');
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en API call a ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.makeAuthenticatedRequest(endpoint, {
      method: 'GET',
    });
  }

  async post(endpoint, data) {
    return this.makeAuthenticatedRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.makeAuthenticatedRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.makeAuthenticatedRequest(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
