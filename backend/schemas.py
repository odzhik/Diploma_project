from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

# 🔹 Вывод пользователя (без пароля)
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

# 🔹 Обновление данных пользователя
class UserUpdate(BaseModel):
    username: str
    email: EmailStr

# 🔹 Смена пароля
class PasswordChange(BaseModel):
    old_password: str
    new_password: str


# Схема для создания пользователя
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

# Схема для отображения пользователя (без пароля)
class UserOut(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool

    class Config:
        from_attributes = True  # Позволяет Pydantic работать с SQLAlchemy-моделями

# Схема для создания события
class EventCreate(BaseModel):
    name: str
    description: Optional[str] = None
    location: str
    date: datetime
    price: int

# Схема для отображения события
class EventOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    location: str
    date: datetime
    price: int

    class Config:
        from_attributes = True


# Схема для токена
class Token(BaseModel):
    access_token: str
    token_type: str
class UserLogin(BaseModel):
    email: str
    password: str