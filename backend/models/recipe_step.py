from sqlalchemy import Column, Integer, Text, ForeignKey
from . import Base

class RecipeStep(Base):
    __tablename__ = "recipe_steps"

    id = Column(Integer, primary_key=True)
    recipe_id = Column(Integer, ForeignKey('recipes.id'), nullable=False)
    step_number = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
