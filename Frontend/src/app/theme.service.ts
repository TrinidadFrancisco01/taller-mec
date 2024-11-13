import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal('light-theme');

  constructor() {
    // Recuperar el tema guardado en localStorage si existe
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.theme.set(savedTheme);
      document.documentElement.className = savedTheme;
    }
  }

  toggleTheme() {
    const newTheme = this.theme() === 'light-theme' ? 'dark-theme' : 'light-theme';
    this.theme.set(newTheme);
    document.documentElement.className = newTheme;
    if (typeof Storage !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    } else {
      console.warn('LocalStorage no es compatible con este navegador.');
    }
  }

  getCurrentTheme() {
    return this.theme();
  }
}
