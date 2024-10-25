import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://vercel.com/trinidadfrancisco01s-projects/taller-backend/users'; // Asegúrate de que esta es la URL base correcta

  constructor(private http: HttpClient) {}

  // Método para solicitar el código de verificación
  requestVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-verification-code`, { email })
      .pipe(catchError(this.handleError));
  }

  // Método para verificar el código de restablecimiento
  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-reset-code`, { email, code })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.error.message || 'Algo salió mal; por favor, inténtalo de nuevo más tarde.'));
  }
}