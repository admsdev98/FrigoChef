from fastapi import Depends
from repositories.user_repository import UserRepository

class UserService:
    def __init__(self, user_repository: UserRepository = Depends(UserRepository)):
        self.user_repository = user_repository

    def set_user_preferences(self, data: dict, user_id: str):
        try:
            existing = self.user_repository.get_user_nutritional_preferences(user_id)
            
            if existing:
                result = self.user_repository.update_user_nutritional_preferences(user_id, data)
            else:
                result = self.user_repository.insert_user_nutritional_preferences(user_id, data)
            
            return {"message": "Preferencias guardadas correctamente", "data": result}
        except Exception as e:
            print(f"Error setting user preferences: {e}")
            raise e

    def get_user_preferences(self, user_id: str):
        try:
            user_nutritional_preferences = self.user_repository.get_user_nutritional_preferences(user_id)
            
            if not user_nutritional_preferences:
                return {
                    "allergens": [],
                    "diet_type": [],
                    "preferred_foods": [],
                    "avoid_foods": [],
                    "favorite_dishes": []
                }
            
            return user_nutritional_preferences
        except Exception as e:
            print(f"Error fetching user preferences: {e}")
            raise e

    def get_user_profile(self, user_id: str):
        try:
            profile = self.user_repository.get_user_profile(user_id)
            if not profile:
                # Should not happen if trigger works, but handle gracefully
                return {}
            return profile
        except Exception as e:
            print(f"Error fetching user profile: {e}")
            raise e

    def update_user_profile(self, user_id: str, data: dict):
        try:
            # Filter out None values to avoid overwriting with nulls if partial update
            clean_data = {k: v for k, v in data.items() if v is not None}
            return self.user_repository.update_user_profile(user_id, clean_data)
        except Exception as e:
            print(f"Error updating user profile: {e}")
            raise e

