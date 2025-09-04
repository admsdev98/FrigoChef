from agents import function_tool
from clients.supabase_client import SupabaseClient

from schemas.recipe_schema import Recipe, RecipeIngredient, RecipeInsert, RecipeIngredientInsert

def get_recipes_by_user_id(user_id: int):
    try:
        client = SupabaseClient().get_client()
        recipes = client.from_("recipes").select("*").eq("user_id", user_id).execute()
        return [Recipe.model_validate(item) for item in (recipes.data or [])]
    except Exception as e:
        print(f"Error fetching recipes: {e}")
        return []
    
def get_recipe_ingredients(recipe_id: int):
    try:
        client = SupabaseClient().get_client()
        ingredients = client.from_("recipe_ingredients").select("*").eq("recipe_id", recipe_id).execute()
        
        return [RecipeIngredient.model_validate(item) for item in (ingredients.data or [])]
    except Exception as e:
        print(f"Error fetching ingredients: {e}")
        return []

@function_tool(description_override="Insert a new recipe")
def insert_recipe(recipe: RecipeInsert):
    try:
        client = SupabaseClient().get_client()
        response = client.table("recipes").insert(recipe.model_dump(mode="json")).execute()
        return Recipe.model_validate(response.data[0]) if response.data else None
    except Exception as e:
        print(f"Error inserting recipe: {e}")
        return None

@function_tool(description_override="Insert ingredients associated with a recipe")
def insert_recipe_ingredient(ingredient: RecipeIngredientInsert):
    try:
        client = SupabaseClient().get_client()
        response = client.table("recipe_ingredients").insert(ingredient.model_dump(mode="json")).execute()
        return RecipeIngredient.model_validate(response.data[0]) if response.data else None
    except Exception as e:
        print(f"Error inserting recipe ingredient: {e}")
        return None