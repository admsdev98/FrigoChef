from clients.supabase_client import SupabaseClient

from repositories.user_repository import get_user_nutritional_preferences, get_user_nutritional_preference_by_user, insert_user_nutritional_preferences, update_user_nutritional_preferences

def set_user_preferences(data: dict, user_id: str):
    try:
        existing = get_user_nutritional_preferences(user_id)
        
        if existing:
            result = update_user_nutritional_preferences(user_id, data)
        else:
            result = insert_user_nutritional_preferences(user_id, data)
        
        return {"message": "Preferencias guardadas correctamente", "data": result}
    except Exception as e:
        print(f"Error setting user preferences: {e}")
        return {"error": "Error al guardar las preferencias"}

def get_user_preferences(user_id: str):
    try:
        user_nutritional_preferences = get_user_nutritional_preferences(user_id)
        
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
        return None
