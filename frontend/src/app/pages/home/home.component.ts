import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {

  // Все события
  allEvents: any[] = [];

  // Карусель (первые 4 события)
  carouselEvents: any[] = [];

  // Отфильтрованные события по категории
  filteredEvents: any[] = [];

  // Текущий слайд
  currentSlideIndex = 0;

  // Сдвиг карусели по оси X
  carouselOffset = 0;

  // Ширина одного слайда
  slideWidth = 0;

  // Инжектим HTTP-клиент и Router для навигации
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();

    // Получаем ширину слайда после загрузки DOM
    setTimeout(() => {
      const slide = document.querySelector('.carousel-item') as HTMLElement;
      this.slideWidth = slide?.offsetWidth || 0;
    }, 0);
  }

  // Моковые данные с сервера (в будущем заменим на API)
  fetchEvents(): void {
    this.allEvents = [
      { id: 1, image: '/images/event1.jpg', name: 'Concert in Almaty', date: 'March 15', location: 'Republic Palace', price: 30, category: 'concerts' },
      { id: 2, image: '/images/event2.jpg', name: 'Movie Night', date: 'March 16', location: 'Esentai Mall', price: 'Free', category: 'movies' },
      { id: 3, image: '/images/event3.jpg', name: 'Football Match', date: 'March 18', location: 'Central Stadium', price: 15, category: 'sport' },
      { id: 4, image: '/images/event4.jpg', name: 'Comedy Show', date: 'March 20', location: 'Theatre', price: 25, category: 'entertainment' },
      { id: 5, image: '/images/event5.jpg', name: 'Art Exhibition', date: 'March 22', location: 'Kasteyev Museum', price: 10, category: 'other' }
    ];

    // Первые 4 события для карусели
    this.carouselEvents = this.allEvents.slice(0, 4);

    // Все события по умолчанию
    this.filteredEvents = [...this.allEvents];
  }

  // Следующий слайд
  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.carouselEvents.length;
    this.updateCarouselPosition();
  }

  // Предыдущий слайд
  prevSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.carouselEvents.length) % this.carouselEvents.length;
    this.updateCarouselPosition();
  }

  // Переход к конкретному слайду
  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    this.updateCarouselPosition();
  }

  // Обновляем позицию карусели
  updateCarouselPosition(): void {
    this.carouselOffset = -this.currentSlideIndex * this.slideWidth;
  }

  // Фильтрация событий по категориям
  filterEvents(category: string): void {
    this.filteredEvents = category === 'all' 
      ? [...this.allEvents] 
      : this.allEvents.filter(event => event.category === category);
  }

  // Переход на страницу детального события
  goToEventPage(event: any): void {
    this.router.navigate(['/event', event.id]);
  }
}



