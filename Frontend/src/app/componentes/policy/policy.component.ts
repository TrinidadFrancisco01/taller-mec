import { Component, signal, WritableSignal } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-policy',
  standalone: true,
  templateUrl: './policy.component.html',
})
export class PolicyComponent {
  description: WritableSignal<string | null> = signal(null);  // Almacenar solo la descripción

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getPrivacyPolicy().subscribe({
      next: (data) => {
        // Accedemos al primer elemento del array y tomamos la propiedad description
        if (data.length > 0) {
          this.description.set(data[0].description);  // Extraemos la descripción
        }
      },
      error: (err) => {
        console.error('Error al obtener la política', err);
      }
    });
  }
}
