from fastapi import Depends
from repositories.recipe_repository import RecipeRepository
from schemas.recipe_schema import CompleteRecipe, Recipe

class RecipeService:
    def __init__(self, recipe_repository: RecipeRepository = Depends(RecipeRepository)):
        self.recipe_repository = recipe_repository

    def get_recipes_by_user(self, user_id: int) -> list[CompleteRecipe]:
        try:
            recipes = self.recipe_repository.get_recipes_by_user_id(user_id)

            if not recipes:
                return []

            complete_recipes = []
            for recipe in recipes:
                complete_recipes.append(self.get_recipe_additional_info(recipe))

            return complete_recipes
        except Exception as e:
            print(f"Error fetching recipes: {e}")
            raise e

    def get_recipe_additional_info(self, recipe: Recipe) -> CompleteRecipe:
        try:
            ingredients = self.recipe_repository.get_recipe_ingredients(recipe.id) or []
            steps = self.recipe_repository.get_recipe_steps(recipe.id) or []
            image = self.recipe_repository.get_recipe_image(recipe.id)

            return CompleteRecipe(
                **recipe.model_dump(),
                ingredients=ingredients,
                steps=steps,
                image=image
            )

        except Exception as e:
            print(f"Error fetching recipe additional info for {recipe.id}: {e}")
            raise e
    
    def delete_recipe_by_id(self, recipe_id: int, user_id: int) -> bool:
        try:
            return self.recipe_repository.delete_by_id(recipe_id, user_id)
        except Exception as e:
            print(f"Error deleting recipe {recipe_id}: {e}")
            raise e
        