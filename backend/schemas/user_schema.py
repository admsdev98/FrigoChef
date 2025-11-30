
from pydantic import BaseModel
from typing import List, Optional


class NutritionPreferences(BaseModel):
    allergens: Optional[List[str]] = []
    diet_type: Optional[List[str]] = []
    preferred_foods: Optional[List[str]] = []
    avoid_foods: Optional[List[str]] = []
    favorite_dishes: Optional[List[str]] = []


class UserProfile(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
