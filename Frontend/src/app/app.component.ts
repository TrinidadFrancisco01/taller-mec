import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginComponent, RegistroComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly theme = signal('light-theme');
  contactInfo = signal({ direccion: '', correo: '', telefono: '' });
  pageTitle = signal(''); // Agregar señal para el título
  pageSlogan = signal(''); // Agregar señal para el eslogan
  socialLinks = signal<any[]>([]); // Cambiar a 'any' en lugar de 'SocialNetwork'


  constructor(private http: HttpClient) {
    effect(() => {
      document.body.className = this.theme();
    });
    
    this.loadContactInfo();
    this.loadPageTitle(); // Cargar el título al iniciar
    this.loadPageSlogan(); // Cargar el eslogan al iniciar
    this.loadSocialLinks(); // Cargar enlaces de redes sociales al iniciar

  }
  loadSocialLinks() {
    const platforms = ['Facebook', 'Twitter', 'Instagram'];
    platforms.forEach(platform => this.loadSocialLink(platform));
  }

  loadSocialLink(platform: string) {
    this.http.get<any>(`https://taller-backend-two.vercel.app/socialnetworks/most-recent/${platform}`).subscribe({
        next: (data) => {
            this.socialLinks.update(existingLinks => {
                const index = existingLinks.findIndex(link => link.type === platform);
                if (index !== -1) {
                    existingLinks[index].url = data.url; // Actualiza el enlace existente
                } else {
                    existingLinks.push(data); // Agrega un nuevo enlace
                }
                return existingLinks;
            });
        },
        error: (err) => console.error(`Error al cargar las redes sociales de ${platform}:`, err),
    });
}


  toggleTheme() {
    this.theme.update(current => current === 'light-theme' ? 'dark-theme' : 'light-theme');
  }

  loadContactInfo() {
    this.http.get<any>('https://taller-backend-two.vercel.app/contactdata/recent').subscribe({
      next: (data) => {
        this.contactInfo.set(data);
      },
      error: (err) => console.error('Error al cargar datos de contacto', err),
    });
  }

  loadPageTitle() {
    this.http.get<{ title: string }>('https://taller-backend-two.vercel.app/titlepage/recent').subscribe({
      next: (data) => {
        if (data && data.title) {
          this.pageTitle.set(data.title); // Actualizar el título
        } else {
          console.error('No se encontró el título en los datos');
        }
      },
      error: (err) => console.error('Error al cargar el título de la página:', err),
    });
  }

  loadPageSlogan() {
    this.http.get<{ slogan: string }>('https://taller-backend-two.vercel.app/slogan/recent').subscribe({
      next: (data) => {
        if (data && data.slogan) {
          this.pageSlogan.set(data.slogan); // Actualizar el eslogan
        } else {
          console.error('No se encontró el eslogan en los datos');
        }
      },
      error: (err) => console.error('Error al cargar el eslogan de la página:', err),
    });
  }

  getIcon(platform: string): string {
    switch (platform) {
      case 'Facebook':
        return 'https://cdn-icons-png.flaticon.com/512/124/124010.png';
      case 'Twitter':
        return 'https://cdn-icons-png.flaticon.com/512/733/733579.png';
      case 'Instagram':
        return 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png';
      default:
        return '';
    }
  }
  
}
