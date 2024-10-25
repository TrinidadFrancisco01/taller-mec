import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://taller-backend-two.vercel.app/users/login'; // Cambia a tu endpoint correcto
  

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string; recaptcha: string }): Observable<any> {
    return this.http.post(this.apiUrl, credentials);
  }
}