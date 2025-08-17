from clients.supabase_client import SupabaseClient

from repositories.recipe_repository import get_recipes_by_user_id, get_recipe_ingredients      
from schemas.recipe_schema import CompleteRecipe, Recipe, RecipeIngredient

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
        ingredients = get_recipe_ingredients(recipe.id)  # List[RecipeIngredient]

        if ingredients is None:
            ingredients = []

        return CompleteRecipe(
            **recipe.model_dump(),
            ingredients=ingredients
        )

    except Exception as e:
        print(f"Error fetching recipe additional info for {recipe.id}: {e}")
        return None

        