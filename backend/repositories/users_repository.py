from sqlalchemy.orm import Session

from models.user import User

class UsersRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username(self, username: str):
        return self.db.query(User).filter(User.username == username).first()

    def list(self, limit: int = 100, offset: int = 0):
        return self.db.query(User).offset(offset).limit(limit).all()

    def create(self, **kwargs):
        user = User(**kwargs)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user_id: int, **kwargs):
        user = self.get_by_id(user_id)
        if not user:
            return None
        for k, v in kwargs.items():
            setattr(user, k, v)
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user_id: int):
        user = self.get_by_id(user_id)
        if not user:
            return False
        self.db.delete(user)
        self.db.commit()
        return True
