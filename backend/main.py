from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .config import engine, Base, SessionLocal  # ✅ Импорт из config.py
from backend import models, schemas, crud, auth
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from backend.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

# Создаем приложение FastAPI
app = FastAPI()

# Подключаем маршруты авторизации
app.include_router(auth_router)
# Создаем таблицы (если их нет)
Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Функция для получения сессии БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Маршрут: Главная страница
@app.get("/")
def read_root():
    return {"message": "Добро пожаловать в Event Platform!"}

# ------------- РАБОТА С ПОЛЬЗОВАТЕЛЯМИ -------------

# Создание пользователя
@app.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email уже используется")
    return crud.create_user(db, user)

# Получение списка пользователей
@app.get("/users/", response_model=list[schemas.UserOut])
def get_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

# Получение пользователя по ID
@app.get("/users/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user

# Функция получения текущего пользователя по токену
def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Не удалось подтвердить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = auth.decode_access_token(token)
    if payload is None:
        raise credentials_exception
    user = crud.get_user_by_email(db, payload.get("sub"))
    if user is None:
        raise credentials_exception
    return user

#  Получение профиля пользователя
@app.get("/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

#  Обновление профиля пользователя
@app.put("/users/me", response_model=schemas.UserOut)
def update_user_profile(
    user_update: schemas.UserUpdate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    return crud.update_user(db, current_user.id, user_update)

# 🔹 Смена пароля пользователя
@app.patch("/users/me/password")
def change_password(
    password_data: schemas.PasswordChange, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    success = crud.change_user_password(db, current_user.id, password_data)
    if not success:
        raise HTTPException(status_code=400, detail="Старый пароль не верен")
    return {"message": "Пароль успешно обновлен"}

# ------------- РАБОТА С СОБЫТИЯМИ -------------

# Создание события
@app.post("/events/", response_model=schemas.EventOut)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db, event)

# Получение списка событий
@app.get("/events/", response_model=list[schemas.EventOut])
def get_events(db: Session = Depends(get_db)):
    return crud.get_events(db)

# Получение события по ID
@app.get("/events/{event_id}", response_model=schemas.EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = crud.get_event(db, event_id)
    if event is None:
        raise HTTPException(status_code=404, detail="Событие не найдено")
    return event

# Авторизация и получение токена
@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Неверный email или пароль")
    access_token = auth.create_access_token({"sub": user.email}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}


origins = [
    "http://localhost:4200",  # Angular
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешенные источники
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы (GET, POST и т. д.)
    allow_headers=["*"],  # Разрешаем все заголовки
)