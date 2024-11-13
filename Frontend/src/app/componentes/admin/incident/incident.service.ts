import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  name: string; // Agregamos el campo de nombre del usuario
}

export interface Incident {
  id: string;
  description: string;
  status: string;
  date: Date;
  userId: string; // Relacionamos la incidencia con el ID del usuario
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = 'https://taller-backend-two.vercel.app/incidentmonitor'; // Cambia la URL según tu configuración

  constructor(private http: HttpClient) {}

  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/incidents`);
  }

  getBlockedIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}/incidents-bloqued`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  blockUser(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/block-user/${id}`, {});
  }

  unblockUser(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/unblock-user/${id}`, {});
  }
}
