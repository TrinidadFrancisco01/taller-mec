import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './verificar-codigo.component.html'
})
export class VerifyCodeComponent {
  verifyCodeForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  email: string = ''; // Asume que este email se pasa como parámetro o se obtiene de alguna manera

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.verifyCodeForm = this.fb.group({
      code: ['', [Validators.required]]
    });
  }

  requestCode(): void {
    this.authService.requestVerificationCode(this.email).subscribe({
      next: (response) => {
        this.successMessage = 'Código de verificación enviado. Por favor, revisa tu correo electrónico.';
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error al solicitar el código. Inténtalo de nuevo.';
      }
    });
  }

  onSubmit(): void {
    if (this.verifyCodeForm.valid) {
      const code = this.verifyCodeForm.get('code')?.value;

      this.authService.verifyResetCode(this.email, code).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Código verificado correctamente.';
          // Si el código fue verificado correctamente, redirigir a la vista para restablecer contraseña
          this.router.navigate(['/nueva_contra']);  // Aquí redirige a la ruta de restablecimiento de contraseña
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error al verificar el código. Inténtalo de nuevo.';
        }
      });
    }
  }
}
