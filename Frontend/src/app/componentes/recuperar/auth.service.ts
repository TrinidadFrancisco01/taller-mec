import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://taller-backend-two.vercel.app/users/request-password-reset'; // Correcto

  constructor(private http: HttpClient) {}

  // Enviar correo de recuperación de contraseña
  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post(this.apiUrl, { email });
  }  

  // Verificar el código de recuperación ingresado por el usuario
  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post('https://taller-backend-two.vercel.app/users/verify-reset-code', { email, code });
  }
}
