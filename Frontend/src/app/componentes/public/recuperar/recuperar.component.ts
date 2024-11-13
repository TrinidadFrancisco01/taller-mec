import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './recuperar.component.html'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.get('email')?.value;
  
      this.authService.sendPasswordResetEmail(email).subscribe({
        next: (response) => {
          // Si recibes un mensaje exitoso, redirige a la verificación
          this.successMessage = response.message;
          this.router.navigate(['/verificar'], { queryParams: { email } });
        },
        error: (error) => {
          // Maneja el error cuando el correo no está registrado
          if (error.status === 404) {
            this.errorMessage = error.error.message || 'El correo no está registrado.';
          } else {
            this.errorMessage = 'Hubo un error al enviar el correo. Inténtalo de nuevo.';
          }
        }
      });
    }
  }
  
  
}
