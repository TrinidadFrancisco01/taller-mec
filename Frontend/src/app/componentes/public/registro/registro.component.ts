import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationService } from './registration.service';
import { PasswordCheckService } from './password-check.service';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  imports: [ReactiveFormsModule, CommonModule],
})
export class RegistroComponent implements OnInit {
  registrationForm: FormGroup;
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  passwordStrength: number = 0;
  isPasswordCompromised: boolean = false;

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private passwordCheckService: PasswordCheckService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(30)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.strongPasswordValidator
      ]],
    });
  }

  ngOnInit() {
    this.registrationForm.get('password')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(password => {
          this.passwordStrength = this.calculatePasswordStrength(password);
          return this.passwordCheckService.checkPassword(password);
        })
      )
      .subscribe(isCompromised => {
        this.isPasswordCompromised = isCompromised;
        if (isCompromised) {
          this.registrationForm.get('password')?.setErrors({ compromised: true });
        }
      });
  }

  strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !passwordValid ? { weakPassword: true } : null;
  }

  calculatePasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) strength += 20;
    return Math.min(strength, 100);
  }

  onSubmit() {
    if (this.registrationForm.valid && !this.isPasswordCompromised) {
      this.registrationService.register(this.registrationForm.value).subscribe({
        next: (response) => {
          this.message = 'Usuario registrado con éxito';
          this.messageType = 'success';
          setTimeout(() => {
            this.router.navigate(['/principal']);
          }, 2000);
        },
        error: (error) => {
          if (error.status === 409) {
            this.message = 'Error: El correo ya está en uso';
          } else {
            this.message = 'Error: El correo ya está en uso';
          }
          this.messageType = 'error';
        }
      });
    } else {
      this.message = 'Por favor, completa correctamente el formulario y asegúrate de que la contraseña no haya sido comprometida.';
      this.messageType = 'error';
    }
  }
}