from sqlalchemy.orm import Session
from models.recipe import Recipe

class RecipesRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, recipe_id: int):
        return self.db.query(Recipe).filter(Recipe.id == recipe_id).first()

    def list(self, limit: int = 100, offset: int = 0):
        return self.db.query(Recipe).offset(offset).limit(limit).all()

    def create(self, **kwargs):
        recipe = Recipe(**kwargs)
        self.db.add(recipe)
        self.db.commit()
        self.db.refresh(recipe)
        return recipe

    def update(self, recipe_id: int, **kwargs):
        recipe = self.get_by_id(recipe_id)
        if not recipe:
            return None
        for k, v in kwargs.items():
            setattr(recipe, k, v)
        self.db.commit()
        self.db.refresh(recipe)
        return recipe

    def delete(self, recipe_id: int):
        recipe = self.get_by_id(recipe_id)
        if not recipe:
            return False
        self.db.delete(recipe)
        self.db.commit()
        return True
