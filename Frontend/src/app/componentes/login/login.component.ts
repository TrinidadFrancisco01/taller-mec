import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, NgxCaptchaModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  attemptCount: number = 0; // Contador de intentos fallidos
  maxAttempts: number = 5;  // Máximo de intentos permitidos
  siteKey: string = '6Ldx0mMqAAAAALJBaW5Lm4_7lrTaXEcExyt46fDu';
  isAccountLocked: boolean = false; // Indicador de cuenta bloqueada

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  // Maneja el evento de éxito del reCAPTCHA
  handleCaptchaSuccess(captchaResponse: string) {
    this.loginForm.patchValue({ recaptcha: captchaResponse });
  }

  // Maneja el evento de error del reCAPTCHA
  handleCaptchaError(error: any) {
    console.error('Error en reCAPTCHA:', error);
    this.loginForm.patchValue({ recaptcha: '' });
  }

  // Función que se llama al enviar el formulario
  onSubmit() {
    this.errorMessage = null;

    if (this.isAccountLocked) {
      this.errorMessage = 'Tu cuenta está bloqueada debido a múltiples intentos fallidos.';
      return;
    }

    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      const dataToSend = {
        email: credentials.email,
        password: credentials.password,
        recaptcha: credentials.recaptcha
      };

      this.authService.login(dataToSend).subscribe({
        next: (response) => {
          console.log('Inicio de sesión exitoso', response);
          this.router.navigate(['/principal']);
          this.attemptCount = 0; // Reiniciar intentos en caso de éxito
        },
        error: (error) => {
          console.error('Error al iniciar sesión', error);
          if (error.status === 401) {
            this.errorMessage = 'Correo o contraseña incorrectos.';
            this.attemptCount++; // Incrementar contador de intentos fallidos

            if (this.attemptCount >= this.maxAttempts) {
              this.isAccountLocked = true; // Bloquear cuenta tras 5 intentos
              this.errorMessage = 'Tu cuenta ha sido bloqueada después de múltiples intentos fallidos.';
            }
          } else {
            this.errorMessage = error.message || 'Error desconocido, intenta de nuevo.';
          }
        }
      });
    }
  }
}
