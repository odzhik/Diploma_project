import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ApiService } from './services/api.service';
import { CommonModule } from '@angular/common'; // 👈 Добавляем

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterModule, 
    MatToolbarModule, 
    CommonModule // 👈 Это нужно для структурных директив (ngIf, ngFor)
  ]
})
export class AppComponent implements OnInit {
  title = 'event-platform';
  events: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getEvents().subscribe(data => {
      this.events = data;
    });
  }
}




