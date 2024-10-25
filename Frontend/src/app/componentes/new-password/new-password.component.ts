import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-password.component.html'
})
export class NewPasswordComponent {
  newPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.newPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): any {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  onSubmit(): void {
    if (this.newPasswordForm.valid) {
      const password = this.newPasswordForm.get('password')?.value;

      this.authService.updatePassword(password).subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Contraseña actualizada con éxito.';
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Error al actualizar la contraseña. Inténtalo de nuevo.';
        }
      });
    }
  }
}
