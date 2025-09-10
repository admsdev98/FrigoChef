from clients.supabase_client import SupabaseClient

from repositories.recipe_repository import get_recipe_steps, get_recipes_by_user_id, get_recipe_ingredients, delete_by_id   
from schemas.recipe_schema import CompleteRecipe, Recipe, RecipeIngredient, RecipeStep

def get_recipes_by_user(user_id: int):
    try:
        recipes = get_recipes_by_user_id(user_id)

        if recipes is None:
            return []

        complete_recipes = []
        for recipe in recipes:
            complete_recipes.append(get_recipe_additional_info(recipe))

        return complete_recipes
    except Exception as e:
        print(f"Error fetching recipes: {e}")
        return []

def get_recipe_additional_info(recipe: Recipe) -> CompleteRecipe:
    try:
        ingredients = get_recipe_ingredients(recipe.id)

        if ingredients is None:
            ingredients = []

        steps = get_recipe_steps(recipe.id)

        if steps is None:
            steps = []

        return CompleteRecipe(
            **recipe.model_dump(),
            ingredients=ingredients,
            steps=steps 
        )

    except Exception as e:
        print(f"Error fetching recipe additional info for {recipe.id}: {e}")
        return None
    
def delete_recipe_by_id(recipe_id: int, user_id: int):
    try:
        return delete_by_id(recipe_id, user_id)
    except Exception as e:
        print(f"Error deleting recipe {recipe_id}: {e}")
        return False
        