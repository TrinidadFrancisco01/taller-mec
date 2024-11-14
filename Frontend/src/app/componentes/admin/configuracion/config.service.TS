import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configApiUrl = 'https://taller-backend-two.vercel.app/configure'; // URL del backend para configuración
  private imagesApiUrl = 'https://taller-backend-two.vercel.app/images/update/67354be52974778166a2ec0d'; // URL fija para actualizar la imagen

  constructor(private http: HttpClient) {}

  // Obtener la configuración más reciente
  getConfiguration(): Observable<any> {
    return this.http.get<any>(`${this.configApiUrl}`);
  }

  // Actualizar la configuración
  updateConfiguration(id: string, config: any): Observable<any> {
    return this.http.patch<any>(`${this.configApiUrl}/${id}`, config);
  }

  // Actualizar la imagen utilizando la URL fija
  updateImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.put(this.imagesApiUrl, formData);
  }
}
