import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentService, Incident, User } from './incident.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-incident',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './incident.component.html',
})
export class IncidentComponent implements OnInit {
  incidents: Incident[] = [];
  blockedIncidents: Incident[] = [];
  users: User[] = [];

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.loadIncidents();
    this.loadBlockedIncidents();
    this.loadUsers();
  }

  loadIncidents() {
    this.incidentService.getIncidents().subscribe({
      next: (data) => {
        this.incidents = data;
      },
      error: (err) => {
        console.error('Error al cargar las incidencias', err);
      }
    });
  }

  loadBlockedIncidents() {
    this.incidentService.getBlockedIncidents().subscribe({
      next: (data) => {
        this.blockedIncidents = data;
      },
      error: (err) => {
        console.error('Error al cargar las incidencias bloqueadas', err);
      }
    });
  }

  loadUsers() {
    this.incidentService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error al cargar los usuarios', err);
      }
    });
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Desconocido';
  }

  blockUser(id: string) {
    this.incidentService.blockUser(id).subscribe({
      next: () => {
        this.loadIncidents(); // Recargar incidencias después de bloquear
      },
      error: (err) => {
        console.error('Error al bloquear usuario', err);
      }
    });
  }

  unblockUser(id: string) {
    this.incidentService.unblockUser(id).subscribe({
      next: () => {
        this.loadBlockedIncidents(); // Recargar incidencias bloqueadas después de desbloquear
      },
      error: (err) => {
        console.error('Error al desbloquear usuario', err);
      }
    });
  }
}
