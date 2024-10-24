import { Controller, Get, Param, Post } from '@nestjs/common';
import { IncidentmonitorService } from './incidentmonitor.service';
import { User } from 'src/users/schemas/user-schema';
import { Incident } from 'src/users/schemas/incident-schema';

@Controller('incidentmonitor')
export class IncidentmonitorController {
    constructor(private incidentService: IncidentmonitorService) { }

    @Get('users')
    getUsers(): Promise<User[]> {
        return this.incidentService.getUsers();
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
