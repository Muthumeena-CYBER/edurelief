from pydantic import BaseModel
from app.models.user import UserRole

class RegisterSchema(BaseModel):
    email: str
    password: str
    role: UserRole

class LoginSchema(BaseModel):
    email: str
    password: str
