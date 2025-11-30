import React from 'react';
import { useRecipes } from '../context/RecipeContext';

export function GenerationProgress() {
    const { isGenerating, generationProgress } = useRecipes();

    if (!isGenerating) return null;

    return (
        <div className="fixed top-4 right-4 z-50 w-80 bg-white rounded-xl shadow-lg border border-emerald-100 p-4 animate-fade-in-down">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <span className="font-semibold text-emerald-900 text-sm">Generando receta...</span>
                </div>
                <span className="text-xs font-medium text-emerald-600">{Math.round(generationProgress)}%</span>
            </div>

            <div className="w-full bg-emerald-50 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${generationProgress}%` }}
                ></div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
                La IA está creando tu receta. Puedes seguir navegando.
            </p>
        </div>
    );
}
