import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { IncidentmonitorService } from './incidentmonitor.service';
import { User } from 'src/users/schemas/user-schema';
import { Incident } from 'src/users/schemas/incident-schema';

@Controller('incidentmonitor')
export class IncidentmonitorController {
    constructor(private incidentService: IncidentmonitorService) { }

    @Get('clients')
    getUsers(): Promise<User[]> {
        return this.incidentService.getUsers();
    }

    // Obtener todos los usuarios 'client' que están bloqueados
    @Get('blocked-clients')
    async getBlockedClients(): Promise<User[]> {
        return this.incidentService.getBlockedClients();
    }

    // Obtener todos los usuarios 'client' que no están bloqueados
    @Get('unblocked-clients')
    async getActiveClients(): Promise<User[]> {
        return this.incidentService.getActiveClients();
    }

    @Get('incidents')
    getIncidents(): Promise<Incident[]> {
        return this.incidentService.getIncident();
    }

    @Get('incidents-bloqued')
    getIncidentsBloqued(): Promise<Incident[]> {
        return this.incidentService.getBlockedIncidents();
    }

    @Post('block-user/:id')
    async blockUser(@Param('id') userId: string): Promise<User> {
        return this.incidentService.blockUserById(userId);
    }

    @Post('unblock-user/:id')
    async unblockUser(@Param('id') userId: string): Promise<User> {
        return this.incidentService.unblockUserById(userId);
    }
}
