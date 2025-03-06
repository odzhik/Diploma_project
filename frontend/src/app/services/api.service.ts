import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api'; // Убедись, что адрес правильный

  constructor(private http: HttpClient) {} // ✅ HttpClient должен быть внутри конструктора

  getEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/events`);
  }
}


