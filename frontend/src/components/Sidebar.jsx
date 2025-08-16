import React from 'react';

function Sidebar({ recipes = [], onSelectRecipe = () => {}, onLogout = () => {}, onConfig = () => {} }) {
  return (
    <aside className="sidebar w-72 flex flex-col h-screen">
      <div className="p-4 border-b">
        <button className="w-full btn-primary" onClick={() => onSelectRecipe(null)}>Crear receta</button>
        <button className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-md" onClick={() => onSelectRecipe('home')}>Inicio</button>
      </div>
      <hr />
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-bold mb-2">Historial de recetas</h3>
        <ul>
          {recipes.map((r, i) => (
            <li key={i} className="mb-2">
              <div className="sidebar-item" onClick={() => onSelectRecipe(r)}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-100 rounded-md flex items-center justify-center text-emerald-700 font-semibold">{(r.title||'R').charAt(0)}</div>
                  <div>
                    <div className="text-sm font-medium">{r.title || `Receta ${i + 1}`}</div>
                    <div className="text-xs muted">{r.type}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">&gt;</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t flex flex-col gap-2">
        <button className="flex items-center gap-2 text-gray-700" onClick={onConfig}>
          <span>⚙️</span> Configuración
        </button>
        <button className="flex items-center gap-2 text-red-600" onClick={onLogout}>
          <span>⏻</span> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
