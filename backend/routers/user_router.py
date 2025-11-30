from fastapi import APIRouter, Depends

from utils.auth_utils import get_current_user
from services.user_service import UserService
from schemas.user_schema import NutritionPreferences, UserProfile

router = APIRouter(prefix="/user", tags=["user"])


@router.post("/nutritional-preferences")
def set_nutritional_preferences(
    data: NutritionPreferences, 
    user = Depends(get_current_user),
    user_service: UserService = Depends(UserService)
):
    return user_service.set_user_preferences(data.model_dump(), user.id)

@router.get("/nutritional-preferences")
def get_nutritional_preferences(
    user = Depends(get_current_user),
    user_service: UserService = Depends(UserService)
):
    return user_service.get_user_preferences(user.id)

@router.get("/profile")
def get_user_profile(
    user = Depends(get_current_user),
    user_service: UserService = Depends(UserService)
):
    return user_service.get_user_profile(user.id)

@router.put("/profile")
def update_user_profile(
    data: UserProfile,
    user = Depends(get_current_user),
    user_service: UserService = Depends(UserService)
):
    return user_service.update_user_profile(user.id, data.model_dump())