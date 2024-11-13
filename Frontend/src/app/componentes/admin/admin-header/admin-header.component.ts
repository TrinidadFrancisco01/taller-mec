import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../public/login/auth.service'; 

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="fixed top-0 left-0 w-full p-4 shadow-lg z-50 bg-gray-800 dark:bg-gray-900 text-white transition-colors duration-300">
      <div class="container mx-auto flex flex-wrap justify-between items-center">
        <a routerLink="/admin" class="flex items-center space-x-2">
          <img src="https://i.postimg.cc/Fz3m2dVm/logo.png" alt="Logo del Taller" class="h-8">
          <span class="font-bold text-xl text-yellow-300">Panel de Administración</span>
        </a>
        <nav class="flex flex-wrap items-center mt-2 md:mt-0">
          <ul class="flex flex-wrap space-x-4 text-lg mr-4">
            <li><a routerLink="/document-crud" class="text-gray-300 hover:text-yellow-400">Documentos</a></li>
            <li><a routerLink="/crud_empresa" class="text-gray-300 hover:text-yellow-400">Contacto</a></li>
            <li><a routerLink="/inidencias" class="text-gray-300 hover:text-yellow-400">Incidencias</a></li>
            <li><button (click)="onLogout()" class="text-gray-300 hover:text-yellow-400">Cerrar Sesión</button></li>
          </ul>
          <!-- Botón de tema -->
          <button 
            (click)="toggleTheme()" 
            class="bg-yellow-500 dark:bg-blue-600 text-white px-3 py-1 rounded hover:bg-yellow-600 dark:hover:bg-blue-700 transition-colors mt-2 md:mt-0">
            Cambiar Tema
          </button>
        </nav>
      </div>
    </header>
    <div class="pt-20"></div>
  `
})
export class AdminHeaderComponent {
  private authService = inject(AuthService);
  currentTheme = 'light-theme';

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    document.documentElement.className = this.currentTheme;
  }

  onLogout() {
    this.authService.logout();
  }
}