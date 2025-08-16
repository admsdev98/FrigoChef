from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db import get_db
from services.auth_service import register_user, login_user, logout_user, get_current_user
from schemas.auth_schema import UserRegisterRequest, UserLoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register_endpoint(user_data: UserRegisterRequest, db: Session = Depends(get_db)):
    return register_user(user_data.username, user_data.email, user_data.password, db)

@router.post("/login")
def login_endpoint(credentials: UserLoginRequest, db: Session = Depends(get_db)):
    return login_user(credentials.identifier, credentials.password, db)

@router.post("/logout")
def logout_endpoint():
    return logout_user("")

@router.get("/user")
def get_user_endpoint(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }