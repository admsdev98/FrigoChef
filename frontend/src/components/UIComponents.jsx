/**
 * Componente de confirmación modal
 */
export const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xs">
        <h3 className="text-lg font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-700 mb-6 text-sm">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';

/**
 * Componente para mostrar errores
 */
export const ErrorMessage = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
      <p className="text-sm">{error}</p>
    </div>
  );
};

/**
 * Componente para botón de carga
 */
export const LoadingButton = ({ isLoading, onClick, children, className = '', disabled = false }) => (
  <button 
    type="button" 
    className={`relative ${className} ${isLoading || disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
    onClick={onClick}
    disabled={isLoading || disabled}
  >
    {isLoading && (
      <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
    )}
    <span className={isLoading ? 'invisible' : ''}>
      {children}
    </span>
  </button>
);
