import React from 'react';

export default function FeedbackToast({ type = 'success', message = '', visible = false, onClose }) {
  if (!visible) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 text-base font-medium transition-all duration-300
      ${type === 'success' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-red-100 text-red-700 border border-red-300'}`}
      role="alert"
    >
      {type === 'success' ? (
        <span className="inline-block text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </span>
      ) : (
        <span className="inline-block text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </span>
      )}
      <span>{message}</span>
      <button
        type="button"
        className="ml-4 text-slate-500 hover:text-slate-800 text-lg font-bold"
        onClick={onClose}
        title="Cerrar"
      >
        ×
      </button>
    </div>
  );
}
