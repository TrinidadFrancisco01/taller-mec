import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { HeaderService } from '../../admin/admin-header/header.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, NgxCaptchaModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  attemptCount: number = 0;
  maxAttempts: number = 5;
  siteKey: string = '6Ldx0mMqAAAAALJBaW5Lm4_7lrTaXEcExyt46fDu';
  isAccountLocked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private headerService: HeaderService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  handleCaptchaSuccess(captchaResponse: string) {
    this.loginForm.patchValue({ recaptcha: captchaResponse });
  }

  handleCaptchaError(error: any) {
    console.error('Error en reCAPTCHA:', error);
    this.loginForm.patchValue({ recaptcha: '' });
  }

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
          if (response && response.token) { 
            this.authService.setCookieToken(response.token);
            this.redirectBasedOnRole(response.token); 
            this.attemptCount = 0; 
          } else {
            this.errorMessage = 'No se recibió un token.';
          }
        },
        error: (error) => {
          this.handleLoginError(error);
        }
      });
    }
  }

  private redirectBasedOnRole(token: string | null) {
    if (token) {
      const payload = this.decodeJwt(token);
      const role = payload.role;

      if (role === 'admin') {
        // Solo cambia a 'admin' si el usuario tiene el rol adecuado
        this.headerService.setHeaderType('admin');
        this.router.navigate(['/crud_empresa']);
      } else {
        this.headerService.setHeaderType('default');
        this.router.navigate(['/principal']);
      }
    }
  }

  private decodeJwt(token: string): any {
    const base64Url = token.split('.')[1]; 
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  private handleLoginError(error: any) {
    if (error.status === 401) {
      this.errorMessage = 'Correo o contraseña incorrectos.';
      this.attemptCount++;
      if (this.attemptCount >= this.maxAttempts) {
        this.isAccountLocked = true;
        this.errorMessage = 'Tu cuenta ha sido bloqueada después de múltiples intentos fallidos.';
      }
    } else {
      this.errorMessage = error.message || 'Error desconocido.';
    }
  }
}
