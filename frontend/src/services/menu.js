import { apiService } from './api.js';

/**
 * Servicio para manejar operaciones relacionadas con menús
 */
export const menuService = {
  /**
   * Obtiene todos los menús del usuario
   * @returns {Promise<Array>} Lista de menús del usuario
   */
  async getUserMenus() {
    try {
      return await apiService.get('/menus');
    } catch (error) {
      console.error('Error al obtener menús del usuario:', error);
      throw error;
    }
  },

  /**
   * Obtiene un menú específico por ID
   * @param {number} menuId - ID del menú
   * @returns {Promise<Object>} Datos del menú con sus recetas
   */
  async getMenuById(menuId) {
    try {
      return await apiService.get(`/menus/${menuId}`);
    } catch (error) {
      console.error('Error al obtener menú:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo menú
   * @param {Object} menuData - Datos del menú
   * @param {string} menuData.title - Título del menú
   * @param {Object} menuData.menu_metadata - Metadatos del menú (descripción, duración, etc.)
   * @param {Array} menuData.recipe_ids - IDs de las recetas a incluir
   * @returns {Promise<Object>} Menú creado
   */
  async createMenu(menuData) {
    try {
      const validatedMenu = {
        title: menuData.title,
        menu_metadata: menuData.menu_metadata || {},
        recipe_ids: menuData.recipe_ids || []
      };

      return await apiService.post('/menus', validatedMenu);
    } catch (error) {
      console.error('Error al crear menú:', error);
      throw error;
    }
  },

  /**
   * Actualiza un menú existente
   * @param {number} menuId - ID del menú
   * @param {Object} menuData - Datos actualizados del menú
   * @returns {Promise<Object>} Menú actualizado
   */
  async updateMenu(menuId, menuData) {
    try {
      return await apiService.put(`/menus/${menuId}`, menuData);
    } catch (error) {
      console.error('Error al actualizar menú:', error);
      throw error;
    }
  },

  /**
   * Elimina un menú
   * @param {number} menuId - ID del menú
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async deleteMenu(menuId) {
    try {
      return await apiService.delete(`/menus/${menuId}`);
    } catch (error) {
      console.error('Error al eliminar menú:', error);
      throw error;
    }
  },

  /**
   * Añade una receta a un menú
   * @param {number} menuId - ID del menú
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async addRecipeToMenu(menuId, recipeId) {
    try {
      return await apiService.post(`/menus/${menuId}/recipes`, { recipe_id: recipeId });
    } catch (error) {
      console.error('Error al añadir receta al menú:', error);
      throw error;
    }
  },

  /**
   * Elimina una receta de un menú
   * @param {number} menuId - ID del menú
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async removeRecipeFromMenu(menuId, recipeId) {
    try {
      return await apiService.delete(`/menus/${menuId}/recipes/${recipeId}`);
    } catch (error) {
      console.error('Error al eliminar receta del menú:', error);
      throw error;
    }
  },

  /**
   * Genera una lista de compras basada en un menú
   * @param {number} menuId - ID del menú
   * @param {Object} options - Opciones para la lista de compras
   * @param {number} options.servings - Número de porciones (opcional)
   * @param {Array} options.exclude_ingredients - Ingredientes a excluir (opcional)
   * @returns {Promise<Object>} Lista de compras generada
   */
  async generateShoppingList(menuId, options = {}) {
    try {
      return await apiService.post(`/menus/${menuId}/shopping-list`, options);
    } catch (error) {
      console.error('Error al generar lista de compras:', error);
      throw error;
    }
  },

  /**
   * Genera un menú automáticamente basado en preferencias
   * @param {Object} criteria - Criterios para generar el menú
   * @param {number} criteria.days - Número de días para el menú
   * @param {number} criteria.meals_per_day - Comidas por día
   * @param {Array} criteria.dietary_restrictions - Restricciones dietéticas
   * @param {Array} criteria.preferred_cuisines - Cocinas preferidas
   * @returns {Promise<Object>} Menú generado
   */
  async generateMenu(criteria) {
    try {
      const validatedCriteria = {
        days: criteria.days || 7,
        meals_per_day: criteria.meals_per_day || 3,
        dietary_restrictions: criteria.dietary_restrictions || [],
        preferred_cuisines: criteria.preferred_cuisines || [],
        target_calories_per_day: criteria.target_calories_per_day || 2000,
        preferences: criteria.preferences || {}
      };

      return await apiService.post('/menus/generate', validatedCriteria);
    } catch (error) {
      console.error('Error al generar menú:', error);
      throw error;
    }
  },

  /**
   * Genera opciones múltiples de menú para que el usuario elija
   * @param {Object} criteria - Criterios para generar el menú
   * @returns {Promise<Array>} Array de opciones de menú generadas
   */
  async generateMenuOptions(criteria) {
    try {
      const validatedCriteria = {
        days: criteria.days || 7,
        meals_per_day: criteria.meals_per_day || 3,
        dietary_restrictions: criteria.dietary_restrictions || [],
        preferred_cuisines: criteria.preferred_cuisines || [],
        target_calories_per_day: criteria.target_calories_per_day || 2000,
        preferences: criteria.preferences || {},
        generate_options: true // Flag para indicar que queremos múltiples opciones
      };

      // TODO: Reemplazar con llamada real al backend
      // return await apiService.post('/menus/generate-options', validatedCriteria);
      
      // Mock data temporal para desarrollo
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.generateMockMenuOptions(validatedCriteria));
        }, 2000);
      });
    } catch (error) {
      console.error('Error al generar opciones de menú:', error);
      throw error;
    }
  },

  /**
   * Genera datos mock para opciones de menú (temporal para desarrollo)
   * @param {Object} criteria - Criterios para generar el menú
   * @returns {Array} Array de opciones de menú mock
   */
  generateMockMenuOptions(criteria) {
    const mealTypes = ['Desayuno', 'Almuerzo', 'Cena', 'Merienda'].slice(0, criteria.meals_per_day);
    
    const mockRecipes = {
      'Desayuno': [
        'Tostadas integrales con aguacate',
        'Yogur griego con frutos rojos',
        'Avena con plátano y nueces',
        'Huevos revueltos con espinacas',
        'Smoothie de frutas'
      ],
      'Almuerzo': [
        'Ensalada césar con pollo',
        'Sopa de verduras',
        'Wrap de atún y verduras',
        'Bowl de quinoa mediterráneo',
        'Sandwich de pavo y queso'
      ],
      'Cena': [
        'Salmón a la plancha con verduras',
        'Pasta con salsa de tomate',
        'Pollo al horno con patatas',
        'Risotto de champiñones',
        'Tacos de pescado'
      ],
      'Merienda': [
        'Frutos secos mixtos',
        'Manzana con mantequilla de almendra',
        'Batido de proteínas',
        'Galletas de avena',
        'Hummus con vegetales'
      ]
    };

    const options = [
      {
        title: 'Menú Mediterráneo',
        description: 'Enfoque en ingredientes frescos y sabores del Mediterráneo',
        days: criteria.days,
        meals_per_day: criteria.meals_per_day,
        avg_calories_per_day: criteria.target_calories_per_day,
        menu_preview: Array.from({ length: Math.min(criteria.days, 3) }, (_, dayIndex) => ({
          day: dayIndex + 1,
          meals: mealTypes.map(mealType => ({
            meal_type: mealType,
            recipe_name: mockRecipes[mealType][Math.floor(Math.random() * mockRecipes[mealType].length)],
            estimated_calories: Math.floor(criteria.target_calories_per_day / criteria.meals_per_day),
            ingredients: ['Ingrediente 1', 'Ingrediente 2', 'Ingrediente 3'],
            cooking_time: 30
          }))
        }))
      },
      {
        title: 'Menú Equilibrado',
        description: 'Balance perfecto entre proteínas, carbohidratos y vegetales',
        days: criteria.days,
        meals_per_day: criteria.meals_per_day,
        avg_calories_per_day: criteria.target_calories_per_day + 50,
        menu_preview: Array.from({ length: Math.min(criteria.days, 3) }, (_, dayIndex) => ({
          day: dayIndex + 1,
          meals: mealTypes.map(mealType => ({
            meal_type: mealType,
            recipe_name: mockRecipes[mealType][Math.floor(Math.random() * mockRecipes[mealType].length)],
            estimated_calories: Math.floor((criteria.target_calories_per_day + 50) / criteria.meals_per_day),
            ingredients: ['Ingrediente A', 'Ingrediente B', 'Ingrediente C'],
            cooking_time: 25
          }))
        }))
      },
      {
        title: 'Menú Rápido y Fácil',
        description: 'Recetas sencillas para el día a día, máximo 30 minutos',
        days: criteria.days,
        meals_per_day: criteria.meals_per_day,
        avg_calories_per_day: criteria.target_calories_per_day - 50,
        menu_preview: Array.from({ length: Math.min(criteria.days, 3) }, (_, dayIndex) => ({
          day: dayIndex + 1,
          meals: mealTypes.map(mealType => ({
            meal_type: mealType,
            recipe_name: mockRecipes[mealType][Math.floor(Math.random() * mockRecipes[mealType].length)],
            estimated_calories: Math.floor((criteria.target_calories_per_day - 50) / criteria.meals_per_day),
            ingredients: ['Ingrediente X', 'Ingrediente Y', 'Ingrediente Z'],
            cooking_time: 20
          }))
        }))
      }
    ];

    return options;
  },

  /**
   * Guarda una opción de menú seleccionada por el usuario
   * @param {Object} selectedOption - Opción de menú seleccionada
   * @param {Object} criteria - Criterios originales usados para generar el menú
   * @returns {Promise<Object>} Menú guardado
   */
  async saveSelectedMenu(selectedOption, criteria) {
    try {
      const menuData = {
        title: selectedOption.title || `Menú Semanal - ${new Date().toLocaleDateString()}`,
        menu_metadata: {
          description: selectedOption.description,
          days: selectedOption.days,
          meals_per_day: selectedOption.meals_per_day,
          target_calories_per_day: criteria.target_calories_per_day,
          dietary_restrictions: criteria.dietary_restrictions,
          preferred_cuisines: criteria.preferred_cuisines,
          preferences: criteria.preferences,
          created_from_option: true
        },
        daily_menus: selectedOption.menu_preview || selectedOption.daily_menus,
        selected_option_data: selectedOption
      };

      // TODO: Reemplazar con llamada real al backend
      // return await apiService.post('/menus/save-selected', menuData);
      
      // Mock data temporal para desarrollo
      return new Promise((resolve) => {
        setTimeout(() => {
          const savedMenu = {
            id: Math.floor(Math.random() * 1000),
            title: menuData.title,
            days: selectedOption.days,
            meals_per_day: selectedOption.meals_per_day,
            metadata: menuData.menu_metadata,
            daily_menus: this.expandMenuPreview(selectedOption, criteria),
            created_at: new Date().toISOString()
          };
          resolve(savedMenu);
        }, 1500);
      });
    } catch (error) {
      console.error('Error al guardar menú seleccionado:', error);
      throw error;
    }
  },

  /**
   * Expande la preview del menú a todos los días (temporal para desarrollo)
   * @param {Object} selectedOption - Opción de menú seleccionada
   * @param {Object} criteria - Criterios originales
   * @returns {Array} Array de menús diarios expandido
   */
  expandMenuPreview(selectedOption, criteria) {
    const mealTypes = ['Desayuno', 'Almuerzo', 'Cena', 'Merienda'].slice(0, criteria.meals_per_day);
    
    const mockRecipes = {
      'Desayuno': [
        'Tostadas integrales con aguacate',
        'Yogur griego con frutos rojos',
        'Avena con plátano y nueces',
        'Huevos revueltos con espinacas',
        'Smoothie de frutas',
        'Pancakes de avena',
        'Tortilla francesa'
      ],
      'Almuerzo': [
        'Ensalada césar con pollo',
        'Sopa de verduras',
        'Wrap de atún y verduras',
        'Bowl de quinoa mediterráneo',
        'Sandwich de pavo y queso',
        'Gazpacho andaluz',
        'Crema de calabaza'
      ],
      'Cena': [
        'Salmón a la plancha con verduras',
        'Pasta con salsa de tomate',
        'Pollo al horno con patatas',
        'Risotto de champiñones',
        'Tacos de pescado',
        'Lomo de cerdo con puré',
        'Pescado al vapor'
      ],
      'Merienda': [
        'Frutos secos mixtos',
        'Manzana con mantequilla de almendra',
        'Batido de proteínas',
        'Galletas de avena',
        'Hummus con vegetales',
        'Yogur con granola',
        'Té con tostadas'
      ]
    };

    return Array.from({ length: criteria.days }, (_, dayIndex) => ({
      day: dayIndex + 1,
      date: new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      meals: mealTypes.map(mealType => ({
        meal_type: mealType,
        recipe_name: mockRecipes[mealType][dayIndex % mockRecipes[mealType].length],
        name: mockRecipes[mealType][dayIndex % mockRecipes[mealType].length],
        estimated_calories: Math.floor(criteria.target_calories_per_day / criteria.meals_per_day),
        ingredients: [
          'Ingrediente principal',
          'Verdura fresca',
          'Aceite de oliva',
          'Especias variadas'
        ],
        cooking_time: Math.floor(Math.random() * 30) + 15,
        difficulty: ['Fácil', 'Intermedio'][Math.floor(Math.random() * 2)],
        description: `Deliciosa receta de ${mealType.toLowerCase()} perfecta para cualquier ocasión`
      }))
    }));
  },

  /**
   * Obtiene el menú semanal activo del usuario
   * @returns {Promise<Object|null>} Menú activo o null si no existe
   */
  async getActiveWeeklyMenu() {
    try {
      // TODO: Reemplazar con llamada real al backend
      // return await apiService.get('/menus/weekly/active');
      
      // Mock data temporal para desarrollo - simular que no hay menú activo inicialmente
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simular que no hay menú activo para probar el flujo completo
          resolve(null);
        }, 1000);
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null; // No hay menú activo
      }
      console.error('Error al obtener menú semanal activo:', error);
      throw error;
    }
  }
};
