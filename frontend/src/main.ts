import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // ✅ Добавляем HttpClient
import { routes } from './app/app.routes'; // ✅ Исправляем импорт (было appRoutes, а должно быть routes)

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // ✅ Теперь передаём правильное название
    provideHttpClient() // ✅ HttpClient в провайдерах
  ]
}).catch(err => console.error(err));
