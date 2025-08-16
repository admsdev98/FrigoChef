import os

from supabase import create_client, Client


class SupabaseClient:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            url = os.getenv("SUPABASE_URL")
            key = os.getenv("SUPABASE_KEY")
            cls._instance.client = create_client(url, key)
        return cls._instance
    
    def get_client(self) -> Client:
        return self.client