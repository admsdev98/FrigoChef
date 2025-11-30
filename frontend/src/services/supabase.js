import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Validación detallada de las variables de entorno
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL no está definida en .env.local');
  throw new Error('VITE_SUPABASE_URL es requerida');
}

if (!supabaseKey) {
  console.error('❌ VITE_SUPABASE_KEY no está definida en .env.local');
  throw new Error('VITE_SUPABASE_KEY es requerida');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
