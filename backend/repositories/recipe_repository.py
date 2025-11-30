from agents import function_tool
from clients.supabase_client import SupabaseClient
from fastapi import Depends
from utils.exceptions import DatabaseException
from schemas.recipe_schema import Recipe, RecipeIngredient, RecipeStep, RecipeImage, RecipeInsert, RecipeIngredientInsert, RecipeStepsInsert, RecipeImageInsert
from schemas.recipe_schema import Recipe, RecipeIngredient, RecipeStep, RecipeImage, RecipeInsert, RecipeIngredientInsert, RecipeStepsInsert, RecipeImageInsert
class RecipeRepository:
    def __init__(self, client: SupabaseClient = Depends(SupabaseClient)):
        self.client = client.get_client()

    def get_recipes_by_user_id(self, user_id: int) -> list[Recipe]:
        try:
            recipes = self.client.from_("recipes").select("*").eq("user_id", user_id).execute()
            return [Recipe.model_validate(item) for item in (recipes.data or [])]
        except Exception as e:
            print(f"Error fetching recipes: {e}")
            raise DatabaseException(f"Error fetching recipes: {str(e)}")
    
    def get_recipe_ingredients(self, recipe_id: int) -> list[RecipeIngredient]:
        try:
            ingredients = self.client.from_("recipe_ingredients").select("*").eq("recipe_id", recipe_id).execute()
            return [RecipeIngredient.model_validate(item) for item in (ingredients.data or [])]
        except Exception as e:
            print(f"Error fetching ingredients: {e}")
            raise DatabaseException(f"Error fetching ingredients: {str(e)}")
    
    def get_recipe_steps(self, recipe_id: int) -> list[RecipeStep]:
        try:
            steps = self.client.from_("recipe_steps").select("*").eq("recipe_id", recipe_id).execute()
            return [RecipeStep.model_validate(item) for item in (steps.data or [])]
        except Exception as e:
            print(f"Error fetching recipe steps: {e}")
            raise DatabaseException(f"Error fetching recipe steps: {str(e)}")
    
    def get_recipe_image(self, recipe_id: int) -> RecipeImage | None:
        try:
            print(f"DEBUG: Fetching image for recipe_id: {recipe_id}")
            image = self.client.from_("recipe_images").select("*").eq("recipe_id", recipe_id).limit(1).execute()
            print(f"DEBUG: Fetch result: {image.data}")
            return RecipeImage.model_validate(image.data[0]) if image.data else None
        except Exception as e:
            print(f"Error fetching recipe image: {e}")
            # Don't raise here as image is optional
            return None

    def insert_recipe(self, recipe: RecipeInsert) -> Recipe | None:
        try:
            # Extract nested data
            recipe_data = recipe.model_dump(mode="json")
            ingredients = recipe_data.pop("ingredients", None)
            steps = recipe_data.pop("steps", None)
            image_url = recipe_data.pop("image_url", None)
            
            print(f"DEBUG: insert_recipe called. Image URL present: {bool(image_url)}")
            if image_url:
                print(f"DEBUG: Image URL: {image_url}")

            # Insert main recipe
            response = self.client.table("recipes").insert(recipe_data).execute()
            
            if not response.data:
                return None
                
            new_recipe = Recipe.model_validate(response.data[0])
            recipe_id = new_recipe.id

            # Insert ingredients if present
            if ingredients:
                for ing in ingredients:
                    ing["recipe_id"] = recipe_id
                self.client.table("recipe_ingredients").insert(ingredients).execute()

            # Insert steps if present
            if steps:
                steps_insert = {"recipe_id": recipe_id, "instructions": steps}
                self.client.table("recipe_steps").insert(steps_insert).execute()

            # Insert image if present
            if image_url:
                image_insert = {"recipe_id": recipe_id, "image_url": image_url}
                self.client.table("recipe_images").insert(image_insert).execute()

            return new_recipe
        except Exception as e:
            print(f"Error inserting recipe: {e}")
            raise DatabaseException(f"Error inserting recipe: {str(e)}")

    def insert_recipe_ingredient(self, ingredient: RecipeIngredientInsert) -> RecipeIngredient | None:
        try:
            response = self.client.table("recipe_ingredients").insert(ingredient.model_dump(mode="json")).execute()
            return RecipeIngredient.model_validate(response.data[0]) if response.data else None
        except Exception as e:
            print(f"Error inserting recipe ingredient: {e}")
            raise DatabaseException(f"Error inserting recipe ingredient: {str(e)}")

    def insert_recipe_step(self, recipe_steps: RecipeStepsInsert) -> RecipeStepsInsert | None:
        try:
            response = self.client.table("recipe_steps").insert(recipe_steps.model_dump(mode="json")).execute()
            return RecipeStepsInsert.model_validate(response.data[0]) if response.data else None
        except Exception as e:
            print(f"Error inserting recipe step: {e}")
            raise DatabaseException(f"Error inserting recipe step: {str(e)}")
    
    def insert_recipe_image(self, recipe_image: RecipeImageInsert) -> RecipeImage | None:
        try:
            response = self.client.table("recipe_images").insert(recipe_image.model_dump(mode="json")).execute()
            return RecipeImage.model_validate(response.data[0]) if response.data else None
        except Exception as e:
            print(f"Error inserting recipe image: {e}")
            raise DatabaseException(f"Error inserting recipe image: {str(e)}")
    


    def delete_by_id(self, recipe_id: int, user_id: int) -> bool:
        try:
            recipe = self.client.from_("recipes").select("*").eq("id", recipe_id).eq("user_id", user_id).execute()
            
            if not recipe.data:
                return False
            
            self.client.from_("recipe_ingredients").delete().eq("recipe_id", recipe_id).execute()
            self.client.from_("recipe_steps").delete().eq("recipe_id", recipe_id).execute()
            self.client.from_("recipes").delete().eq("id", recipe_id).execute()
            
            return True
        except Exception as e:
            print(f"Error deleting recipe {recipe_id}: {e}")
            raise DatabaseException(f"Error deleting recipe: {str(e)}")

# Standalone functions for Agents
# These instantiate their own repository since agents might not use DI context
def _get_repo():
    return RecipeRepository(SupabaseClient())

@function_tool(description_override="Insert a new recipe with all its details (ingredients, steps, image)")
def insert_recipe(recipe: RecipeInsert):
    result = _get_repo().insert_recipe(recipe)
    if result:
        return {"status": "success", "id": result.id, "title": result.title}
    return {"status": "error", "message": "Failed to insert recipe"}

@function_tool(description_override="Insert ingredients associated with a recipe")
def insert_recipe_ingredient(ingredient: RecipeIngredientInsert):
    result = _get_repo().insert_recipe_ingredient(ingredient)
    if result:
        return {"status": "success", "data": result.model_dump()}
    return {"status": "error", "message": "Failed to insert ingredient"}

@function_tool(description_override="Insert steps associated with a recipe")
def insert_recipe_step(recipe_steps: RecipeStepsInsert):
    result = _get_repo().insert_recipe_step(recipe_steps)
    if result:
        return {"status": "success", "data": result.model_dump()}
    return {"status": "error", "message": "Failed to insert steps"}
    
@function_tool(description_override="Insert image associated with a recipe")
def insert_recipe_image(recipe_image: RecipeImageInsert):
    result = _get_repo().insert_recipe_image(recipe_image)
    if result:
        return {"status": "success", "data": result.model_dump()}
    return {"status": "error", "message": "Failed to insert image"}