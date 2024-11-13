import { Component, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AdminHeaderComponent } from './componentes/admin/admin-header/admin-header.component';
import { HeaderService } from './componentes/admin/admin-header/header.service';
import { ThemeService } from './theme.service';
import { AuthService } from './componentes/public/login/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, AdminHeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  readonly theme = signal('light-theme');
  contactInfo = signal({ direccion: '', correo: '', telefono: '' });
  pageTitle = signal('');
  pageSlogan = signal('');
  socialLinks = signal<{ type: string, url: string }[]>([]);

  constructor(
    private http: HttpClient,
    public headerService: HeaderService,
    public themeService: ThemeService,
    private authService: AuthService
  ) {
    // Configura un efecto para detectar cambios en el tipo de encabezado
    effect(() => {
      console.log('Tipo de header:', this.headerService.getHeaderType());
    });
  }

  ngOnInit() {
    // Verifica el estado de autenticación al iniciar
    this.authService.checkAuthStatus();

    // Cargar la información inicial
    this.loadContactInfo();
    this.loadPageTitle();
    this.loadPageSlogan();
    this.loadSocialLinks();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  loadContactInfo() {
    this.http.get<any>('https://taller-backend-two.vercel.app/contactdata/recent').subscribe({
      next: data => this.contactInfo.set(data),
      error: err => console.error('Error al cargar datos de contacto', err),
    });
  }

  loadPageTitle() {
    this.http.get<{ title: string }>('https://taller-backend-two.vercel.app/titlepage/recent').subscribe({
      next: data => data?.title ? this.pageTitle.set(data.title) : console.error('Título no encontrado'),
      error: err => console.error('Error al cargar el título de la página', err),
    });
  }

  loadPageSlogan() {
    this.http.get<{ slogan: string }>('https://taller-backend-two.vercel.app/slogan/recent').subscribe({
      next: data => data?.slogan ? this.pageSlogan.set(data.slogan) : console.error('Eslogan no encontrado'),
      error: err => console.error('Error al cargar el eslogan', err),
    });
  }

  loadSocialLinks() {
    const platforms = ['Facebook', 'Twitter', 'Instagram'];
    platforms.forEach(platform => this.loadSocialLink(platform));
  }

  loadSocialLink(platform: string) {
    this.http.get<{ type: string, url: string }>(`https://taller-backend-two.vercel.app/socialnetworks/most-recent/${platform}`).subscribe({
      next: data => {
        this.socialLinks.update(existingLinks => {
          const index = existingLinks.findIndex(link => link.type === platform);
          index !== -1 ? (existingLinks[index].url = data.url) : existingLinks.push(data);
          return existingLinks;
        });
      },
      error: err => console.error(`Error al cargar ${platform}`, err),
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

  // Define la función trackByType
  trackByType(index: number, item: { type: string, url: string }): string {
    return item.type;
  }
}