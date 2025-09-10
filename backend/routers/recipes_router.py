
from fastapi import APIRouter, Depends

from utils.auth_utils import get_current_user
from services.recipe_service import delete_recipe_by_id, get_recipes_by_user
from schemas.recipe_schema import CompleteRecipe

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("", response_model=list[CompleteRecipe])
def get_recipes(user = Depends(get_current_user)):
    return get_recipes_by_user(user.id)

@router.delete("/{recipe_id}")
def delete_recipe(recipe_id: int, user=Depends(get_current_user)):
    return delete_recipe_by_id(recipe_id, user.id)