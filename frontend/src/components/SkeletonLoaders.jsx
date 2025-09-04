import React from 'react';

export const NutritionProfileSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col h-full px-4 py-6 overflow-hidden bg-gray-50">
      <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
        {/* Header skeleton compacto */}
        <div className="text-center mb-4 lg:mb-6 flex-shrink-0">
          <div className="h-4 lg:h-5 bg-gray-200 rounded-lg mb-1 w-80 mx-auto animate-pulse"></div>
          <div className="h-3 lg:h-4 bg-gray-200 rounded-lg w-48 mx-auto animate-pulse"></div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Grid skeleton */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 min-h-0">
            {/* Cards skeleton */}
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 shadow-sm animate-pulse">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                  <div>
                    <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
                  <div className="w-full sm:w-auto h-12 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="h-9 bg-gray-200 rounded-xl w-20"></div>
                  <div className="h-9 bg-gray-200 rounded-xl w-16"></div>
                  <div className="h-9 bg-gray-200 rounded-xl w-24"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Favorite dishes skeleton */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 flex-shrink-0 shadow-sm animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4 max-w-3xl">
              <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
              <div className="w-full sm:w-auto h-12 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="h-9 bg-gray-200 rounded-xl w-16"></div>
              <div className="h-9 bg-gray-200 rounded-xl w-20"></div>
            </div>
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="flex-shrink-0 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function ChipSkeleton({ count = 3 }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3 min-h-[32px]">
      {[...Array(count)].map((_, index) => (
        <div 
          key={index} 
          className="h-8 w-16 bg-gray-100 rounded-full animate-pulse"
        ></div>
      ))}
    </div>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-4">
      {/* Título */}
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      
      {/* Ingredientes */}
      <div className="mb-2">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse"></div>
        </div>
      </div>
      
      {/* Instrucciones */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-28 mb-2 animate-pulse"></div>
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-11/12 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse"></div>
        </div>
      </div>
      
      {/* Botones */}
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
      </div>
    </div>
  );
}

// Exportación por defecto para compatibilidad
const SkeletonLoaders = {
  NutritionProfileSkeleton,
  ChipSkeleton,
  RecipeCardSkeleton
};

export { SkeletonLoaders };
export default SkeletonLoaders;
