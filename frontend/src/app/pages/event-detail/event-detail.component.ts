import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  imports: [CommonModule]
})
export class EventDetailComponent implements OnInit {
  event: any;
  userId: number = 12; // Заглушка

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Получаем данные о событии с сервера
    this.http.get(`http://127.0.0.1:8000/events/${eventId}`).subscribe({
      next: (response) => {
        this.event = response;
        console.log('Данные о событии:', this.event);
      },
      error: (error) => {
        console.error('Ошибка загрузки события:', error);
      }
    });
  }

  successMessage: string = '';

  buyTicket() {
    if (this.event.available_tickets > 0) {
      this.event.available_tickets--;
      this.successMessage = '✅ Билет успешно куплен!';
      
      // Очистка сообщения через 5 секунд
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }
  

    if (this.event.available_tickets <= 0) {
      alert('❌ Билеты закончились!');
      return;
    }

    const accessToken = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);

    const ticketData = {
      user_id: this.userId,
      event_id: this.event.id
    };

    this.http.post('http://127.0.0.1:8000/buy_ticket', ticketData, { headers }).subscribe({
      next: (response) => {
        console.log('Билет куплен:', response);
        alert('✅ Билет успешно куплен!');
        
        // Обновляем количество билетов на UI
        this.event.available_tickets -= 1;
      },
      error: (error) => {
        console.error('Ошибка при покупке билета:', error);
        alert('❌ Ошибка при покупке билета');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
