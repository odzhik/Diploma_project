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
  userId: number = 12; // Заглушка, позже заменим на реального пользователя

  allEvents = [
    { id: 1, image: '/images/event1.jpg', name: 'Concert in Almaty', date: 'March 15', location: 'Republic Palace', price: 30, category: 'concerts' },
    { id: 2, image: '/images/event2.jpg', name: 'Movie Night', date: 'March 16', location: 'Esentai Mall', price: 'Free', category: 'movies' },
    { id: 3, image: '/images/event3.jpg', name: 'Football Match', date: 'March 18', location: 'Central Stadium', price: 15, category: 'sport' },
    { id: 4, image: '/images/event4.jpg', name: 'Comedy Show', date: 'March 20', location: 'Theatre', price: 25, category: 'entertainment' },
    { id: 5, image: '/images/event5.jpg', name: 'Art Exhibition', date: 'March 22', location: 'Kasteyev Museum', price: 10, category: 'other' }
  ];

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Event ID:', eventId);
    this.event = this.allEvents.find(event => event.id === eventId);
  }

  buyTicket() {
    if (!this.event) {
      console.error("Мероприятие не найдено!");
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
