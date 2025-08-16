from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register_endpoint():
    pass

@router.post("/login")
def login_endpoint():
    pass

@router.post("/logout")
def logout_endpoint():
    pass

@router.get("/user")
def get_user_endpoint():
    pass