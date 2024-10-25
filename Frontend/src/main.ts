import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';  // Importando las rutas
import { provideHttpClient } from '@angular/common/http'; // Importa aquí

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Proveedor de rutas
    provideHttpClient()     // Proveedor de HttpClient
  ]
}).catch(err => console.error(err));