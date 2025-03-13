import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule]
})
export class HomeComponent {
  items = [
    { img: 'images/event1.jpg' },
    { img: 'images/event2.jpg' },
    { img: 'images/event3.jpg' },
    { img: 'images/event4.jpg' },
  ];

  currentIndex = 0;
  offset = 0;

  nextSlide() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
      this.offset -= this.getSlideWidth();
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.offset += this.getSlideWidth();
    }
  }

  goToSlide(index: number) {
    this.offset = -(this.getSlideWidth() * index);
    this.currentIndex = index;
  }

  getSlideWidth() {
    const carousel = document.querySelector('.carousel-item') as HTMLElement;
    return carousel ? carousel.offsetWidth + 10 : 0; // 10 - это отступ между слайдами
  }
}
