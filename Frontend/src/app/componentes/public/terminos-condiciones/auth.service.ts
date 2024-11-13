import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://taller-backend-two.vercel.app/regulatorydocument/active/terms-and-conditions'; // URL del endpoint para términos y condiciones

  constructor(private http: HttpClient) {}

  // Método para obtener los términos y condiciones
  getTermsConditions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
