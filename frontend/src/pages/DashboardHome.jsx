import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { RecipeInput } from '../components/RecipeInput';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../context/UserContext';
import { useRecipes } from '../context/RecipeContext';

export function DashboardHome() {
    const { session } = useAuth();
    const { userProfile } = useUser();
    const { generateQuickRecipe, isGenerating } = useRecipes();
    const { showToast } = useOutletContext();

    const handleRecipeSubmit = (data) => {
        if (isGenerating) return;

        (async () => {
            try {
                const result = await generateQuickRecipe(data);
                showToast('success', result?.title ? `Receta generada: ${result.title}` : 'Receta generada correctamente');
            } catch (error) {
                showToast('error', error.message || 'Error al generar receta rápida');
            }
        })();
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 min-h-full">
            <div className="text-center mb-8 max-w-2xl">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-900 mb-4 leading-tight">
                    ¡Hola, <span className="text-emerald-600">{userProfile?.username || userProfile?.full_name || session?.user?.email?.split('@')[0]}</span>!
                </h1>
                <p className="text-xl text-emerald-700 mb-2 leading-relaxed">
                    ¿Qué tienes en tu nevera hoy?
                </p>
            </div>
            <RecipeInput
                onSubmit={handleRecipeSubmit}
                isGenerating={false} // Ya no bloqueamos el input visualmente de la misma forma, o podemos usar isGenerating si queremos
            />
            <div className="mt-8 text-center text-xs text-slate-500 max-w-md">
                <p className="mt-4 text-slate-400">
                    Puedes indicar los ingredientes que tienes disponibles mediante texto, voz o imagen.
                </p>
            </div>
        </div>
    );
}
