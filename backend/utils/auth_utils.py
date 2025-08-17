
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import os
from supabase import create_client, Client

security = HTTPBearer()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")


supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        response = supabase.auth.get_user(token)
        user = response.user
        if user:
            return user
        else:
            raise HTTPException(status_code=401, detail="User not found in Supabase")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")
