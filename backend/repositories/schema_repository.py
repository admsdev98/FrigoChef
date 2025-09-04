from agents import function_tool
from clients.supabase_client import SupabaseClient

@function_tool(description_override="Get the schema of all tables in the database")
def get_all_table_schemas():
    return {
        "recipes": {
            "id": {"type": "integer", "nullable": False, "auto_increment": True},
            "user_id": {"type": "text", "nullable": False},
            "title": {"type": "text", "nullable": False},
            "recipe_metadata": {"type": "jsonb", "nullable": True},
            "created_at": {"type": "timestamp", "nullable": False, "default": "now()"},
            "source_type": {"type": "text", "nullable": False},
            "source_data": {"type": "text", "nullable": False}
        },
        "recipe_ingredients": {
            "recipe_id": {"type": "integer", "nullable": False},
            "name": {"type": "text", "nullable": False},
            "quantity": {"type": "text", "nullable": False},
            "unit": {"type": "text", "nullable": False}
        }
    }