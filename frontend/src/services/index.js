// Servicios principales de la aplicación
export { apiService } from './api.js';
export { authService } from './auth.js';
export { userService } from './user.js';
export { recipeService } from './recipe.js';
export { menuService } from './menu.js';
export { shoppingListService } from './shoppingList.js';
export { supabase } from './supabase.js';

/**
 * Objeto que contiene todos los servicios para importación conveniente
 */
export const services = {
  api: () => import('./api.js').then(m => m.apiService),
  auth: () => import('./auth.js').then(m => m.authService),
  user: () => import('./user.js').then(m => m.userService),
  recipe: () => import('./recipe.js').then(m => m.recipeService),
  menu: () => import('./menu.js').then(m => m.menuService),
  shoppingList: () => import('./shoppingList.js').then(m => m.shoppingListService),
  supabase: () => import('./supabase.js').then(m => m.supabase)
};
