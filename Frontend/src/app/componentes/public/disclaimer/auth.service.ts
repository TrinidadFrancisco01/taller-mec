import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://taller-backend-two.vercel.app/regulatorydocument/active/legal-disclaimers'; // Endpoint para Deslinde Legal

  constructor(private http: HttpClient) {}

  // Método para obtener el Deslinde Legal
  getDisclaimer(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
