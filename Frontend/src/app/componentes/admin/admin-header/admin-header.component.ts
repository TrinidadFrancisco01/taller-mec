import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../public/login/auth.service'; 
import { ConfigService } from '../configuracion/config.service'; 
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="fixed top-0 left-0 w-full p-4 shadow-lg z-50 bg-gray-800 dark:bg-gray-900 text-white transition-colors duration-300">
      <div class="container mx-auto flex justify-between items-center">
        <a routerLink="/admin" class="flex items-center space-x-2">
          <img *ngIf="logoUrl" [src]="logoUrl" alt="Logo del Taller" class="h-8">
          <span class="font-bold text-xl text-yellow-300">Panel de Administración</span>
        </a>
        <button 
          class="md:hidden text-gray-300 hover:text-yellow-400 focus:outline-none" 
          (click)="toggleMenu()">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <nav [ngClass]="{'translate-x-0': isMenuOpen, 'translate-x-full': !isMenuOpen}" class="fixed top-0 right-0 h-full w-64 bg-gray-800 dark:bg-gray-900 text-white transform transition-transform duration-300 md:relative md:translate-x-0 md:flex md:items-center md:w-auto">
          <ul class="flex flex-col md:flex-row md:space-x-4 text-lg mt-4 md:mt-0 p-4 md:p-0">
            <li><a routerLink="/document-crud" class="text-gray-300 hover:text-yellow-400" (click)="closeMenu()">Documentos</a></li>
            <li><a routerLink="/crud_empresa" class="text-gray-300 hover:text-yellow-400" (click)="closeMenu()">Contacto</a></li>
            <li><a routerLink="/inidencias" class="text-gray-300 hover:text-yellow-400" (click)="closeMenu()">Incidencias</a></li>
            <li><a routerLink="/configuracion" class="text-gray-300 hover:text-yellow-400" (click)="closeMenu()">Configuración</a></li>
            <li><button (click)="onLogout(); closeMenu()" class="text-gray-300 hover:text-yellow-400">Cerrar Sesión</button></li>
          </ul>
          <button 
            (click)="toggleTheme()" 
            class="bg-yellow-500 dark:bg-blue-600 text-white px-3 py-1 rounded hover:bg-yellow-600 dark:hover:bg-blue-700 transition-colors mt-2 md:mt-0 ml-0 md:ml-4">
            Cambiar Tema
          </button>
        </nav>
      </div>
    </header>
    <div class="pt-20"></div>
  `
})
export class AdminHeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private configService = inject(ConfigService);
  logoUrl: string | null = null;  // Ahora solo es un string o null
  currentTheme = 'light-theme';
  isMenuOpen = false;

  ngOnInit() {
    this.getLogoUrl();  // Obtiene la URL de la imagen
  }

  getLogoUrl() {
    // Asignamos directamente la URL de la imagen
    this.logoUrl = 'https://taller-backend-two.vercel.app/images/67354be52974778166a2ec0d';
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    document.documentElement.className = this.currentTheme;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  onLogout() {
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideMenu = target.closest('nav');
    const clickedMenuButton = target.closest('button');
    if (!clickedInsideMenu && !clickedMenuButton && this.isMenuOpen) {
      this.closeMenu();
    }
  }
}
