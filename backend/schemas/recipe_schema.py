from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# Pydantic models to retrieve data
class RecipeMetadata(BaseModel):
    tags: List[str]
    calorias: int
    
class RecipeStepMetadata(BaseModel):
    instruction: str
    step_number: int
    
class RecipeIngredient(BaseModel):
    recipe_id: int
    name: str
    quantity: str
    unit: str

class RecipeStep(BaseModel):
    id: int
    recipe_id: int
    instructions: List[RecipeStepMetadata]
    
class RecipeImage(BaseModel):
    id: int
    recipe_id: int
    image_url: str

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
    steps: List[RecipeStep]
    image: Optional[RecipeImage]
    created_at: datetime
    source_type: str
    source_data: str

# Pydantic models to insert data

class RecipeMetadataInsert(BaseModel):
    tags: List[str]
    calorias: int
    
class RecipeStepMetadataInsert(BaseModel):
    step_number: int
    instruction: str

class RecipeIngredientCreate(BaseModel):
    name: str
    quantity: str
    unit: str

class RecipeInsert(BaseModel):
    user_id: str
    title: str
    recipe_metadata: Optional[RecipeMetadataInsert]
    source_type: str
    source_data: str
    ingredients: Optional[List[RecipeIngredientCreate]] = None
    steps: Optional[List[RecipeStepMetadataInsert]] = None
    image_url: Optional[str] = None

class RecipeIngredientInsert(BaseModel):
    recipe_id: int
    name: str
    quantity: str
    unit: str
    
class RecipeStepsInsert(BaseModel):
    recipe_id: int
    instructions: List[RecipeStepMetadataInsert]
    
class RecipeImageInsert(BaseModel):
    recipe_id: int
    image_url: str
