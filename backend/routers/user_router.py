
from fastapi import APIRouter, Depends

from utils.auth_utils import get_current_user
from services.user_service import set_user_preferences, get_user_preferences
from schemas.user_schema import NutritionPreferences

router = APIRouter(prefix="/user", tags=["user"])


@router.post("/nutritional-preferences")
def set_nutritional_preferences(data: NutritionPreferences, user = Depends(get_current_user)):
    return set_user_preferences(data.model_dump(), user.id)

@router.get("/nutritional-preferences")
def get_nutritional_preferences(user = Depends(get_current_user)):
    return get_user_preferences(user.id)