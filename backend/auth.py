from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.config import SECRET_KEY, ALGORITHM, SessionLocal
from backend.models import User
from dotenv import load_dotenv
import os
from passlib.context import CryptContext
from . import models, schemas, security

router = APIRouter()

# Загружаем переменные окружения
load_dotenv()

# Настраиваем хеширование паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Время жизни токена (30 минут)
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Используем OAuth2 для авторизации
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_db():
    """Функция для создания сессии базы данных"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    """Хеширует пароль перед сохранением в БД."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяет, соответствует ли введенный пароль хешированному."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Создает JWT-токен с заданным временем жизни."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Расшифровывает JWT-токен и возвращает данные."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def authenticate_user(db: Session, username: str, password: str):
    """Проверяет пользователя по базе данных."""
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password):
        return None
    return user


@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Эндпоинт для получения JWT-токена"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login")
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """Аутентификация пользователя"""
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=400, detail="Неверный email или пароль")

    # Генерируем токен
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def get_me(user: models.User = Depends(security.get_current_user)):
    """Получение данных о текущем пользователе"""
    return {"username": user.username, "email": user.email}