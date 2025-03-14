import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8000/api/events';

  constructor(private http: HttpClient) {}

  getEventById(eventId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${eventId}`);
  }  
}

