import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://taller-backend-two.vercel.app/regulatorydocument/active/privacy-policy'; // Asegúrate de que esta URL es correcta

  constructor(private http: HttpClient) {}

  // Método para obtener la política de privacidad
  getPrivacyPolicy(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
