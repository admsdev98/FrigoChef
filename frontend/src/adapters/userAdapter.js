/**
 * Adapts backend user preferences to frontend format
 */
export const adaptUserPreferences = (backendPrefs) => {
    if (!backendPrefs) return {};
    return {
        allergens: backendPrefs.allergens || [],
        dietType: backendPrefs.diet_type || [],
        preferredFoods: backendPrefs.preferred_foods || [],
        avoidFoods: backendPrefs.avoid_foods || [],
        favoriteDishes: backendPrefs.favorite_dishes || [],
    };
};

/**
 * Adapts frontend preferences to backend format
 */
export const adaptPreferencesPayload = (frontendPrefs) => {
    return {
        allergens: frontendPrefs.allergens || [],
        diet_type: frontendPrefs.dietType || [],
        preferred_foods: frontendPrefs.preferredFoods || [],
        avoid_foods: frontendPrefs.avoidFoods || [],
        favorite_dishes: frontendPrefs.favoriteDishes || [],
    };
};
