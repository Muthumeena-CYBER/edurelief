import enum
import uuid
from sqlalchemy import Column, String, Boolean, Enum
from app.db.base import Base

class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    PARENT = "PARENT"
    DONOR = "DONOR"
    COUNSELOR = "COUNSELOR"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
