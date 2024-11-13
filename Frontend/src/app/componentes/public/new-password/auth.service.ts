import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://taller-backend-two.vercel.app/users';  // Asegúrate de ajustar esto con tu URL de backend

  constructor(private http: HttpClient) {}

  // Servicio para verificar el código de reseteo
  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, { email, code });
  }

  // Servicio para actualizar la contraseña después de verificar el código
  updatePassword(password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-password`, { password });
  }

  // Servicio para solicitar el código de verificación
  requestVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-code`, { email });
  }
}
