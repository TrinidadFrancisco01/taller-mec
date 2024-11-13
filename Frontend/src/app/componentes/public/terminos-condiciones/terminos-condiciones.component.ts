import { Component, signal, WritableSignal } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-terminos-condiciones',
  standalone: true,
  imports: [],
  templateUrl: './terminos-condiciones.component.html',
  styles: ``
})
export class TerminosCondicionesComponent {
  description: WritableSignal<string | null> = signal(null);  // Signal para almacenar la descripción

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getTermsConditions().subscribe({
      next: (data) => {
        // Accedemos al primer elemento del array y extraemos la descripción
        if (data.length > 0) {
          this.description.set(data[0].description);  // Extraemos la descripción
        }
      },
      error: (err) => {
        console.error('Error al obtener los términos y condiciones', err);
      }
    });
  }

}
