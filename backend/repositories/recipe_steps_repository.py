from sqlalchemy.orm import Session
from models.recipe_step import RecipeStep

class RecipeStepsRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_for_recipe(self, recipe_id: int):
        return self.db.query(RecipeStep).filter(RecipeStep.recipe_id == recipe_id).order_by(RecipeStep.step_number).all()

    def create(self, **kwargs):
        step = RecipeStep(**kwargs)
        self.db.add(step)
        self.db.commit()
        self.db.refresh(step)
        return step

    def update(self, step_id: int, **kwargs):
        step = self.db.query(RecipeStep).filter(RecipeStep.id == step_id).first()
        if not step:
            return None
        for k, v in kwargs.items():
            setattr(step, k, v)
        self.db.commit()
        self.db.refresh(step)
        return step

    def delete(self, step_id: int):
        step = self.db.query(RecipeStep).filter(RecipeStep.id == step_id).first()
        if not step:
            return False
        self.db.delete(step)
        self.db.commit()
        return True
