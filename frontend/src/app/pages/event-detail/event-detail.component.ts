import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  imports: [CommonModule]
})
export class EventDetailComponent implements OnInit {

  event: any;

  allEvents = [
    { id: 1, image: '/images/event1.jpg', name: 'Concert in Almaty', date: 'March 15', location: 'Republic Palace', price: 30, category: 'concerts' },
    { id: 2, image: '/images/event2.jpg', name: 'Movie Night', date: 'March 16', location: 'Esentai Mall', price: 'Free', category: 'movies' },
    { id: 3, image: '/images/event3.jpg', name: 'Football Match', date: 'March 18', location: 'Central Stadium', price: 15, category: 'sport' },
    { id: 4, image: '/images/event4.jpg', name: 'Comedy Show', date: 'March 20', location: 'Theatre', price: 25, category: 'entertainment' },
    { id: 5, image: '/images/event5.jpg', name: 'Art Exhibition', date: 'March 22', location: 'Kasteyev Museum', price: 10, category: 'other' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Event ID:', eventId);
    this.event = this.allEvents.find(event => event.id === eventId);
  }
  

  goBack(): void {
    this.router.navigate(['/']);
  }
}

