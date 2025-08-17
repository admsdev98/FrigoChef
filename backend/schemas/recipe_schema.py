from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class RecipeMetadata(BaseModel):
    tags: List[str]
    calorias: int
    
class RecipeIngredient(BaseModel):
    id: int
    recipe_id: int
    name: str
    quantity: str
    unit: str

class Recipe(BaseModel):
    id: int
    user_id: str
    title: str
    recipe_metadata: Optional[RecipeMetadata]
    created_at: datetime
    source_type: str
    source_data: str

class CompleteRecipe(BaseModel):
    id: int
    user_id: str
    title: str
    recipe_metadata: Optional[RecipeMetadata]
    ingredients: List[RecipeIngredient]
    created_at: datetime
    source_type: str
    source_data: str