from clients.supabase_client import SupabaseClient
from fastapi import Depends
from utils.exceptions import DatabaseException

class UserRepository:
    def __init__(self, client: SupabaseClient = Depends(SupabaseClient)):
        self.client = client.get_client()

    def get_user_nutritional_preferences(self, user_id: str) -> dict | None:
        try:
            response = self.client.table("user_preferences").select("preferences").eq("user_id", user_id).execute()
            if response and response.data and len(response.data) > 0:
                return response.data[0]['preferences']
            return None
        except Exception as e:
            print(f"Error fetching user preferences: {e}")
            raise DatabaseException(f"Error fetching user preferences: {str(e)}")

    def get_user_nutritional_preference_by_user(self, user_id: str) -> str | None:
        try:
            response = self.client.table("user_preferences").select("id").eq("user_id", user_id).execute()
            if response and response.data and len(response.data) > 0:
                return response.data[0]['id']
            return None
        except Exception as e:
            print(f"Error fetching user preferences: {e}")
            raise DatabaseException(f"Error fetching user preferences: {str(e)}")
    
    def insert_user_nutritional_preferences(self, user_id: str, data: dict):
        try:
            response = self.client.table("user_preferences").insert({"preferences": data, "user_id": user_id}).execute()
            return response.data
        except Exception as e:
            print(f"Error inserting user preferences: {e}")
            raise DatabaseException(f"Error inserting user preferences: {str(e)}")
    
    def update_user_nutritional_preferences(self, user_id: str, data: dict):
        try:
            response = self.client.table("user_preferences").update({"preferences": data}).eq("user_id", user_id).execute()
            return response.data
        except Exception as e:
            print(f"Error updating user preferences: {e}")
            raise DatabaseException(f"Error updating user preferences: {str(e)}")

    def delete_user_nutritional_preferences(self, user_id: str):
        try:
            response = self.client.table("user_preferences").delete().eq("user_id", user_id).execute()
            return response.data
        except Exception as e:
            print(f"Error deleting user preferences: {e}")
            raise DatabaseException(f"Error deleting user preferences: {str(e)}")

    def get_user_profile(self, user_id: str) -> dict | None:
        try:
            response = self.client.table("profiles").select("*").eq("id", user_id).execute()
            if response and response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error fetching user profile: {e}")
            raise DatabaseException(f"Error fetching user profile: {str(e)}")

    def update_user_profile(self, user_id: str, data: dict):
        try:
            response = self.client.table("profiles").update(data).eq("id", user_id).execute()
            return response.data
        except Exception as e:
            print(f"Error updating user profile: {e}")
            raise DatabaseException(f"Error updating user profile: {str(e)}")

