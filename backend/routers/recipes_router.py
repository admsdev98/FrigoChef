from fastapi import APIRouter, Depends

from utils.auth_utils import get_current_user
from services.recipe_service import RecipeService
from schemas.recipe_schema import CompleteRecipe

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("", response_model=list[CompleteRecipe])
def get_recipes(
    user = Depends(get_current_user),
    recipe_service: RecipeService = Depends(RecipeService)
):
    return recipe_service.get_recipes_by_user(user.id)

@router.delete("/{recipe_id}")
def delete_recipe(
    recipe_id: int, 
    user=Depends(get_current_user),
    recipe_service: RecipeService = Depends(RecipeService)
):
    return recipe_service.delete_recipe_by_id(recipe_id, user.id)