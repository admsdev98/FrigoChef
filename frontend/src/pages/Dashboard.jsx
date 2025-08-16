import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import RecipeCreator from '../components/RecipeCreator';

function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleCreateRecipe = (recipe) => {
    setRecipes([recipe, ...recipes]);
    setSelectedRecipe(recipe);
  };
  const handleLogout = () => {
    document.cookie = 'session=; Max-Age=0; path=/';
    window.location.href = '/';
  };
  const handleConfig = () => {
    alert('Configuración básica (mockup)');
  };

  return (
    <div className="flex h-screen">
      <Sidebar recipes={recipes} onSelectRecipe={setSelectedRecipe} onLogout={handleLogout} onConfig={handleConfig} />
      <main className="flex-1 flex flex-col items-center justify-start bg-gray-50 py-8">
        <div className="w-full max-w-3xl px-4">
          <h2 className="text-3xl font-bold mb-6">Panel de recetas</h2>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <RecipeCreator onCreate={handleCreateRecipe} />
          </div>

          {selectedRecipe && (
            <div className="mt-6 card">
              <h3 className="font-bold mb-2">Receta creada</h3>
              {selectedRecipe.type === 'text' && <p>{selectedRecipe.content}</p>}
              {selectedRecipe.type === 'image' && <img src={URL.createObjectURL(selectedRecipe.content)} alt="receta" className="w-32 h-32 object-cover rounded-md" />}
              {selectedRecipe.type === 'audio' && <audio controls src={URL.createObjectURL(selectedRecipe.content)} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
