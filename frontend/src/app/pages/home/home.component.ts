import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InterestSelectorComponent } from '../../components/interest-selector/interest-selector.component'; // Указываем путь к компоненту
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, RouterModule, FormsModule, BsDatepickerModule, InterestSelectorComponent] // Добавляем InterestSelectorComponent в imports
  
})
export class HomeComponent implements OnInit, OnDestroy {
  allEvents: any[] = [];
  carouselEvents: any[] = [];
  filteredEvents: any[] = [];

  currentSlideIndex = 0;
  carouselOffset = 0;
  slideWidth = 0;
  autoSlideInterval: any;

  allDatesSelected = true;
  selectedDate: string = 'all';
  availableDates: { day: string; month: string; fullDate: string; dayOfWeek: string }[] = [];

  currentOffset: number = 0; // Смещение для показа 2 недель
  daysToShow: number = 14; // Количество дней в одном периоде

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.generateDates();
    this.fetchEvents();

    setTimeout(() => {
      const slide = document.querySelector('.carousel-item') as HTMLElement;
      this.slideWidth = slide?.offsetWidth || 0;
    }, 0);

    this.startAutoSlide();
  }

  generateDates(): void {
    const today = new Date();
    this.availableDates = [];
  
    const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  
    for (let i = 0; i < 42; i++) { // 6 недель
      const date = new Date(today);
      date.setDate(today.getDate() + i);
  
      const day = date.getDate().toString().padStart(2, '0');
      const monthNames = ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июня', 'июля', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];
      const month = monthNames[date.getMonth()];
      const dayOfWeek = daysOfWeek[date.getDay()]; // Добавляем день недели
  
      this.availableDates.push({
        day,
        month,
        fullDate: `${day}.${date.getMonth() + 1}.${date.getFullYear()}`,
        dayOfWeek, // Добавили день недели
      });
    }
  }
  

  // Получить текущие 2 недели
  getDisplayedDates(): any[] {
    return this.availableDates.slice(this.currentOffset, this.currentOffset + this.daysToShow);
  }

  // Переключение на предыдущие 2 недели
  prevWeek(): void {
    if (this.currentOffset > 0) {
      this.currentOffset -= this.daysToShow;
    }
  }

  // Переключение на следующие 2 недели
  nextWeek(): void {
    if (this.currentOffset + this.daysToShow < this.availableDates.length) {
      this.currentOffset += this.daysToShow;
    }
  }

  fetchEvents(): void {
    this.allEvents = [
      { id: 1, image: '/images/event1.jpg', name: 'Concert in Almaty', date: '17.03.2025', location: 'Republic Palace', price: 30, category: 'concerts' },
      { id: 2, image: '/images/event2.jpg', name: 'Movie Night', date: '18.03.2025', location: 'Esentai Mall', price: 'Free', category: 'movies' },
      { id: 3, image: '/images/event3.jpg', name: 'Football Match', date: '19.03.2025', location: 'Central Stadium', price: 15, category: 'sport' },
      { id: 4, image: '/images/event4.jpeg', name: 'Comedy Show', date: '20.03.2025', location: 'Theatre', price: 25, category: 'entertainment' },
      { id: 5, image: '/images/event5.jpeg', name: 'Art Exhibition', date: '22.03.2025', location: 'Kasteyev Museum', price: 10, category: 'other' }
    ];

    this.carouselEvents = this.allEvents.slice(0, 4);
    this.filteredEvents = [...this.allEvents]; 
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    this.allDatesSelected = date === 'all';
  
    this.filteredEvents = date === 'all'
      ? [...this.allEvents]
      : this.allEvents.filter(event => {
          const eventDate = new Date(event.date.split('.').reverse().join('-'));
          const selectedDateObj = new Date(date.split('.').reverse().join('-'));
  
          return (
            eventDate.getDate() === selectedDateObj.getDate() &&
            eventDate.getMonth() === selectedDateObj.getMonth() &&
            eventDate.getFullYear() === selectedDateObj.getFullYear()
          );
        });
  }

  goToEventPage(event: any): void {
    this.router.navigate(['/event', event.id]);
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.carouselEvents.length;
    this.updateCarouselPosition();
  }

  prevSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.carouselEvents.length) % this.carouselEvents.length;
    this.updateCarouselPosition();
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    this.updateCarouselPosition();
  }

  updateCarouselPosition(): void {
    this.carouselOffset = -this.currentSlideIndex * this.slideWidth;
  }

  filterEvents(category: string): void {
    this.filteredEvents = category === 'all' 
      ? [...this.allEvents] 
      : this.allEvents.filter(event => event.category === category);
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  stopAutoSlide(): void {
    clearInterval(this.autoSlideInterval);
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }
}


