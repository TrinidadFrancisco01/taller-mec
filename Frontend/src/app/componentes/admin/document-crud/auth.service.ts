import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://taller-backend-two.vercel.app/regulatorydocument'; // URL del backend

  constructor(private http: HttpClient) {}

  // Obtener todos los documentos por tipo
  getAllDocuments(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/documents`); // Asegúrate de que esta URL sea correcta
}

  // Crear un nuevo documento
  createDocument(document: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/new-regulatory-document`, document);
  }

  // Actualizar un documento a "vigente"
  updateDocument(document: any) {
    // Eliminar el uso del `id` en la URL y enviar todo en el body de la solicitud
    return this.http.post(`${this.apiUrl}/update-regulatory-document`, document); 
  }
}
