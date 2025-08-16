from sqlalchemy.orm import Session
from models.recipe_ingredient import RecipeIngredient

class RecipeIngredientsRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_for_recipe(self, recipe_id: int):
        return self.db.query(RecipeIngredient).filter(RecipeIngredient.recipe_id == recipe_id).all()

    def create(self, **kwargs):
        ingredient = RecipeIngredient(**kwargs)
        self.db.add(ingredient)
        self.db.commit()
        self.db.refresh(ingredient)
        return ingredient

    def update(self, ingredient_id: int, **kwargs):
        ingredient = self.db.query(RecipeIngredient).filter(RecipeIngredient.id == ingredient_id).first()
        if not ingredient:
            return None
        for k, v in kwargs.items():
            setattr(ingredient, k, v)
        self.db.commit()
        self.db.refresh(ingredient)
        return ingredient

    def delete(self, ingredient_id: int):
        ingredient = self.db.query(RecipeIngredient).filter(RecipeIngredient.id == ingredient_id).first()
        if not ingredient:
            return False
        self.db.delete(ingredient)
        self.db.commit()
        return True
