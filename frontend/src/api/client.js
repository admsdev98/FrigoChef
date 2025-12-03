import { supabase } from '../services/supabase';

const API_URL = import.meta.env.VITE_FRIGOCHEF_API_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper that handles Auth headers automatically
 */
async function fetchClient(endpoint, options = {}) {
    const { data: { session } } = await supabase.auth.getSession();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `API Error: ${response.statusText}`);
    }

    // Return null for 204 No Content
    if (response.status === 204) return null;

    return response.json();
}

export const apiClient = {
    get: (endpoint) => fetchClient(endpoint, { method: 'GET' }),
    post: (endpoint, body) => fetchClient(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body) => fetchClient(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint) => fetchClient(endpoint, { method: 'DELETE' }),
};
