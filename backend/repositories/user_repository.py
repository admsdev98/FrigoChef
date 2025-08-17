from clients.supabase_client import SupabaseClient

def get_user_nutritional_preferences(user_id):
    try:
        client = SupabaseClient().get_client()
        response = client.table("user_preferences").select("preferences").eq("user_id", user_id).execute()
        if response and response.data and len(response.data) > 0:
            return response.data[0]['preferences']
        return None
    except Exception as e:
        print(f"Error fetching user preferences: {e}")
        return None
        
def get_user_nutritional_preference_by_user(user_id):
    try:
        client = SupabaseClient().get_client()
        response = client.table("user_preferences").select("id").eq("user_id", user_id).execute()
        if response and response.data and len(response.data) > 0:
            return response.data[0]['id']
        return None
    except Exception as e:
        print(f"Error fetching user preferences: {e}")
        return None
    
def insert_user_nutritional_preferences(user_id, data):
    try:
        client = SupabaseClient().get_client()
        response = client.table("user_preferences").insert({"preferences": data, "user_id": user_id}).execute()
        return response.data
    except Exception as e:
        print(f"Error inserting user preferences: {e}")
        return None
    
def update_user_nutritional_preferences(user_id, data):
    try:
        client = SupabaseClient().get_client()
        response = client.table("user_preferences").update({"preferences": data}).eq("user_id", user_id).execute()
        return response.data
    except Exception as e:
        print(f"Error updating user preferences: {e}")
        return None

def delete_user_nutritional_preferences(user_id):
    try:
        client = SupabaseClient().get_client()
        response = client.table("user_preferences").delete().eq("user_id", user_id).execute()
        return response.data
    except Exception as e:
        print(f"Error deleting user preferences: {e}")
        return None
