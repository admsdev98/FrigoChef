import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export function AuthForm({ supabaseClient }) {
  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-800">FrigoChef</h1>
        <p className="text-sm sm:text-base text-slate-600">
          Accede a tu cuenta para generar recetas personalizadas
        </p>
      </div>
      
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-slate-200">
        <Auth
          supabaseClient={supabaseClient}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: {
                background: '#059669',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                padding: '12px 16px',
                fontSize: '16px',
                fontWeight: '500',
                width: '100%'
              },
              anchor: {
                color: '#059669',
                textDecoration: 'none',
                fontSize: '14px'
              },
              input: {
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                padding: '12px 16px',
                fontSize: '16px',
                width: '100%'
              },
              label: {
                fontSize: '14px',
                fontWeight: '500',
                color: '#475569'
              },
              message: {
                fontSize: '14px',
                padding: '8px 0'
              }
            }
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Contraseña',
                button_label: 'Iniciar sesión',
                loading_button_label: 'Iniciando sesión...',
                link_text: '¿Ya tienes una cuenta? Inicia sesión',
                confirmation_text: 'Revisa tu email para confirmar tu cuenta'
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Contraseña',
                button_label: 'Registrarse',
                loading_button_label: 'Registrando...',
                link_text: '¿No tienes una cuenta? Regístrate',
                confirmation_text: 'Revisa tu email para confirmar tu cuenta'
              },
              forgotten_password: {
                email_label: 'Email',
                button_label: 'Enviar instrucciones',
                loading_button_label: 'Enviando...',
                link_text: '¿Olvidaste tu contraseña?',
                confirmation_text: 'Revisa tu email para restablecer tu contraseña'
              }
            }
          }}
        />
      </div>
    </div>
  );
}
