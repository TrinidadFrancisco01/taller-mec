import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUrl = 'https://taller-backend-two.vercel.app/users'; // Ensure this is correct

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
