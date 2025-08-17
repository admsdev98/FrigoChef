from clients.supabase_client import SupabaseClient

from schemas.recipe_schema import Recipe, RecipeIngredient

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