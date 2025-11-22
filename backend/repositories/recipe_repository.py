from agents import function_tool
from clients.supabase_client import SupabaseClient

from schemas.recipe_schema import Recipe, RecipeIngredient, RecipeStep, RecipeImage, RecipeInsert, RecipeIngredientInsert, RecipeStepsInsert, RecipeImageInsert

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
    
def get_recipe_steps(recipe_id: int):
    try:
        client = SupabaseClient().get_client()
        steps = client.from_("recipe_steps").select("*").eq("recipe_id", recipe_id).execute()
        
        return [RecipeStep.model_validate(item) for item in (steps.data or [])]
    except Exception as e:
        print(f"Error fetching recipe steps: {e}")
        return []
    
def get_recipe_image(recipe_id: int):
    try:
        client = SupabaseClient().get_client()
        image = client.from_("recipe_images").select("*").eq("recipe_id", recipe_id).single().execute()
        
        return RecipeImage.model_validate(image.data) if image.data else None
    except Exception as e:
        print(f"Error fetching recipe image: {e}")
        return None

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

@function_tool(description_override="Insert steps associated with a recipe")
def insert_recipe_step(recipe_steps: RecipeStepsInsert):
    try:
        client = SupabaseClient().get_client()
        response = client.table("recipe_steps").insert(recipe_steps.model_dump(mode="json")).execute()
        return RecipeStepsInsert.model_validate(response.data[0]) if response.data else None
    except Exception as e:
        print(f"Error inserting recipe step: {e}")
        return None
    
@function_tool(description_override="Insert steps associated with a recipe")
def insert_recipe_image(recipe_image: RecipeImageInsert):
    try:
        client = SupabaseClient().get_client()
        response = client.table("recipe_images").insert(recipe_image.model_dump(mode="json")).execute()
        return RecipeImage.model_validate(response.data[0]) if response.data else None
    except Exception as e:
        print(f"Error inserting recipe image: {e}")
        return None
    

def delete_by_id(recipe_id: int, user_id: int):
    try:
        client = SupabaseClient().get_client()
        
        recipe = client.from_("recipes").select("*").eq("id", recipe_id).eq("user_id", user_id).execute()
        
        if not recipe.data:
            return False
        
        client.from_("recipe_ingredients").delete().eq("recipe_id", recipe_id).execute()
        client.from_("recipe_steps").delete().eq("recipe_id", recipe_id).execute()
        client.from_("recipes").delete().eq("id", recipe_id).execute()
        
        return True
    except Exception as e:
        print(f"Error deleting recipe {recipe_id}: {e}")
        return False