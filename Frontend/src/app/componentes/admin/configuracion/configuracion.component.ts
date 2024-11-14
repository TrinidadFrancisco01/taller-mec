import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styles: [`
    .alert {
      transition: opacity 0.5s ease-in-out;
    }
  `]
})
export class ConfiguracionComponent implements OnInit {
  config = {
    id: '',
    loginAttempts: 3,
    tokenLifetime: 60,
    emailTitle: '',
    emailGreeting: '',
    emailFarewell: ''
  };

  updateSuccess: boolean | null = null;
  logoUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.loadConfiguration();
    this.loadImage(); // Cambiamos a loadImage para evitar llamar al método inexistente
  }

  loadConfiguration() {
    this.configService.getConfiguration().subscribe({
      next: (data: any) => {
        this.config.id = data._id;
        this.config.loginAttempts = data.intent;
        this.config.tokenLifetime = data.tokenLifetime;
        this.config.emailTitle = data.verificationEmailTitle;
        this.config.emailGreeting = data.verificationEmailGreeting;
        this.config.emailFarewell = data.verificationEmailFarewell;
      },
      error: (err: any) => console.error('Error al cargar la configuración', err)
    });
  }

  loadImage() {
    // Si quieres mostrar la imagen más reciente, puedes reemplazar este método con el código que cargue la URL fija
    // Para este ejemplo, simplemente asumimos que tienes una URL fija o una URL preconfigurada para el `logoUrl`
    this.logoUrl = 'https://taller-backend-two.vercel.app/images/67354be52974778166a2ec0d';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      console.log('Archivo seleccionado:', this.selectedFile.name);
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  }

  updateImage() {
    if (this.selectedFile) {
      this.configService.updateImage(this.selectedFile).subscribe({
        next: (response: any) => {
          console.log('Imagen actualizada exitosamente', response);
          alert('La imagen se actualizó con éxito. Recargando la página...'); // Mostrar mensaje de advertencia
          window.location.reload(); // Recargar la página para mostrar la imagen actualizada
        },
        error: (err: any) => {
          console.error('Error al actualizar la imagen', err);
          alert('Hubo un problema al actualizar la imagen. Por favor, inténtalo de nuevo más tarde.');
        }
      });
    } else {
      console.error('No se ha seleccionado un archivo.');
    }
  }
  

  updateConfiguration() {
    if (this.config.id) {
      this.configService.updateConfiguration(this.config.id, this.config).subscribe({
        next: (response: any) => {
          console.log('Configuración actualizada exitosamente', response);
          this.updateSuccess = true;
        },
        error: (err: any) => {
          console.error('Error al actualizar la configuración', err);
          this.updateSuccess = false;
        }
      });
    } else {
      console.error('No se ha cargado el ID de la configuración.');
    }
  }
}
