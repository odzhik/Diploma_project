import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {

  // Массив всех событий (из бекенда)
  allEvents: any[] = [];

  // Массив событий для карусели (показываем первые 4)
  carouselEvents: any[] = [];

  // Отфильтрованные события (по категории)
  filteredEvents: any[] = [];

  // Текущий индекс слайда в карусели
  currentSlideIndex = 0;

  // Сдвиг карусели
  carouselOffset = 0;

  // Ширина одного слайда (для корректного смещения)
  slideWidth = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Получаем события с бэкенда при загрузке страницы
    this.fetchEvents();

    // Устанавливаем ширину слайда (по ширине контейнера карусели)
    setTimeout(() => {
      const carouselContainer = document.querySelector('.carousel-item') as HTMLElement;
      this.slideWidth = carouselContainer?.offsetWidth || 0;
    }, 0);
  }

  // Получаем события с бэкенда (пока что это mock данные)
  fetchEvents(): void {
    this.allEvents = [
      { image: '/images/event1.jpg', name: 'Concert in Almaty', date: 'March 15', location: 'Republic Palace', price: 30, category: 'concerts' },
      { image: '/images/event2.jpg', name: 'Movie Night', date: 'March 16', location: 'Esentai Mall', price: 'Free', category: 'movies' },
      { image: '/images/event3.jpg', name: 'Football Match', date: 'March 18', location: 'Central Stadium', price: 15, category: 'sport' },
      { image: '/images/event4.jpg', name: 'Comedy Show', date: 'March 20', location: 'Theatre', price: 25, category: 'entertainment' },
      { image: '/images/event5.jpg', name: 'Art Exhibition', date: 'March 22', location: 'Kasteyev Museum', price: 10, category: 'other' }
    ];

    // Показываем первые 4 события в карусели
    this.carouselEvents = this.allEvents.slice(0, 4);

    // По умолчанию все события
    this.filteredEvents = [...this.allEvents];
  }

  // Переключение на следующий слайд
  nextSlide(): void {
    if (this.currentSlideIndex < this.carouselEvents.length - 1) {
      this.currentSlideIndex++;
    } else {
      this.currentSlideIndex = 0; // Возвращаемся к первому слайду
    }

    this.updateCarouselPosition();
  }

  // Переключение на предыдущий слайд
  prevSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    } else {
      this.currentSlideIndex = this.carouselEvents.length - 1; // Переходим на последний слайд
    }

    this.updateCarouselPosition();
  }

  // Переключение по индикатору (круглешки под каруселью)
  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    this.updateCarouselPosition();
  }

  // Обновляем сдвиг карусели
  updateCarouselPosition(): void {
    this.carouselOffset = -this.currentSlideIndex * this.slideWidth;
  }

  // Фильтрация событий по категориям
  filterEvents(category: string): void {
    if (category === 'all') {
      this.filteredEvents = [...this.allEvents]; // Показываем все события
    } else {
      this.filteredEvents = this.allEvents.filter(event => event.category === category);
    }
  }
}
