from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from db import get_db
from models.user import User
from repositories.users_repository import UsersRepository
from utils.auth_utils import hash_password, verify_password, create_access_token, verify_access_token

security = HTTPBearer()

def register_user(username: str, email: str, password: str, db: Session):
    users_repo = UsersRepository(db)
    
    if len(password) < 6:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 6 characters long")
    
    existing_user_email = users_repo.get_by_email(email)
    if existing_user_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    existing_user_username = users_repo.get_by_username(username)
    if existing_user_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    
    hashed_password = hash_password(password)
    
    new_user = users_repo.create(
        username=username,
        email=email,
        hashed_password=hashed_password,
        is_active=True
    )
    
    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }
    }

def login_user(identifier: str, password: str, db: Session):
    users_repo = UsersRepository(db)
    
    user = None
    if "@" in identifier:
        user = users_repo.get_by_email(identifier)
    else:
        user = users_repo.get_by_username(identifier)
    
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account is disabled")
    
    access_token = create_access_token({"sub": str(user.id), "username": user.username})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
    }

def logout_user(token: str):
    return {"message": "Logged out successfully"}

def get_current_user(token: str = Depends(security), db: Session = Depends(get_db)):
    if hasattr(token, 'credentials'):
        token = token.credentials
    
    payload = verify_access_token(token)
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    users_repo = UsersRepository(db)
    user = users_repo.get_by_id(int(user_id))
    
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account is disabled")
    
    return user