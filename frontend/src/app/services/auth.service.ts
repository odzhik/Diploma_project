import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/auth'; // Адрес API бэкенда

  constructor(private http: HttpClient) {}

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
  login(email: string, password: string) {
    return this.http.post<{ access_token: string; refresh_token?: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.access_token) {
            this.saveToken(response.access_token, response.refresh_token);
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
  }

  // Получение токенов
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Проверка аутентификации
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Получение заголовков с токеном
  private getAuthHeaders(): HttpHeaders {
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
    if (!refreshToken) return throwError(() => new Error('No refresh token'));

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
    window.location.href = '/login';
  }

  // Получение токена
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

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

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }
}
