import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/auth'; // Адрес API бэкенда

  private authState = new BehaviorSubject<boolean>(this.hasToken());
  authState$ = this.authState.asObservable(); // Поток для подписки на изменения состояния

  constructor(private http: HttpClient) {}

  // Проверяет, есть ли токен в localStorage
  private hasToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Регистрация пользователя
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, email, password }).pipe(
      catchError((error) => {
        console.error('Ошибка регистрации:', error);
        return throwError(() => error);
      })
    );
  }

  // Логин пользователя
  login(email: string, password: string): Observable<any> {
    return this.http.post<{ access_token: string; refresh_token?: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.access_token) {
            this.saveToken(response.access_token, response.refresh_token);
            this.authState.next(true); // Уведомляем подписчиков об изменении состояния авторизации
          }
        }),
        catchError((error) => {
          console.error('Ошибка авторизации:', error);
          return throwError(() => error);
        })
      );
  }

  // Сохранение токенов в localStorage
  public saveToken(accessToken: string, refreshToken?: string) {
    console.log('Сохраняем токен:', accessToken);
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    this.authState.next(true); // Обновляем состояние аутентификации
  }

  // Получение access токена
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Получение refresh токена
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Проверка, аутентифицирован ли пользователь
  isAuthenticated(): boolean {
    return this.authState.value;
  }

  // Получение заголовков с токеном
  public getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Получение данных пользователя
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Ошибка получения профиля:', error);
        return throwError(() => error);
      })
    );
  }

  // Обновление access_token по refresh_token
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.warn('No refresh token found');
      return EMPTY;
    }

    return this.http.post<any>(`${this.apiUrl}/refresh`, { refresh_token: refreshToken }).pipe(
      tap(response => {
        this.saveToken(response.access_token, response.refresh_token);
      }),
      catchError((error) => {
        console.error('Ошибка обновления токена:', error);
        return throwError(() => error);
      })
    );
  }

  // Выход (удаление токенов)
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.authState.next(false); // Сообщаем подписчикам, что пользователь вышел
    window.location.href = '/login';
  }

  // Получение данных пользователя из localStorage
  getUserData() {
    const userData = localStorage.getItem('user');
    if (!userData) {
      console.warn("Нет данных пользователя в localStorage");
      return null;
    }
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Ошибка парсинга user данных:", error);
      return null;
    }
  }

  // Запрос профиля пользователя
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }

  
}
