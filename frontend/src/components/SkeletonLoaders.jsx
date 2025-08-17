import React from 'react';

export function NutritionProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="h-8 bg-gray-200 rounded mb-6 w-64 animate-pulse"></div>
      
      {[...Array(5)].map((_, index) => (
        <div key={index} className="mb-6">
          <div className="h-6 bg-gray-200 rounded mb-3 w-48 animate-pulse"></div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="h-10 bg-gray-100 rounded mb-3 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, chipIndex) => (
                <div 
                  key={chipIndex} 
                  className="h-8 w-20 bg-gray-100 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      ))}
      
      <div className="h-12 bg-gray-200 rounded w-32 animate-pulse mt-8"></div>
    </div>
  );
}

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
          <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded w-4/6 animate-pulse"></div>
        </div>
      </div>
      
      {/* Instrucciones */}
      <div className="mb-2">
        <div className="h-4 bg-gray-200 rounded w-28 mb-2 animate-pulse"></div>
        <div className="space-y-1">
          <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
          <div className="h-3 bg-gray-100 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
      
      {/* Metadata */}
      <div className="border-t pt-2 space-y-1">
        <div className="h-2 bg-gray-100 rounded w-1/2 animate-pulse"></div>
        <div className="h-2 bg-gray-100 rounded w-1/3 animate-pulse"></div>
      </div>
    </div>
  );
}

export const SkeletonLoaders = {
  NutritionProfile: NutritionProfileSkeleton,
  Chip: ChipSkeleton,
  RecipeCard: RecipeCardSkeleton
};
