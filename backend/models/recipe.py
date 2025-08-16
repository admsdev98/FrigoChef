from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, func
from . import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(255), nullable=False)
    recipe_metadata = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    source_type = Column(String(50), nullable=True)
    source_data = Column(Text, nullable=True)
