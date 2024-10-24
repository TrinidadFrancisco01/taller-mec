import { UsersModule } from './../users/users.module';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user-schema';
import { Model } from 'mongoose';
import { Incident } from 'src/users/schemas/incident-schema';


@Injectable()
export class IncidentmonitorService {
    constructor(@InjectModel(User.name) private UsersModule: Model<User>,
        @InjectModel(Incident.name) private IncidentModule: Model<Incident>) { }

    async getUsers(): Promise<User[]> {
        return this.UsersModule.find().exec();
    }

    async getIncident(): Promise<Incident[]> {
        return this.IncidentModule.find().exec();
    }

    async getBlockedIncidents(): Promise<Incident[]> {
        return this.IncidentModule.find({ description: { $regex: /bloqueado/i } }).exec();
    }

    async blockUserById(userId: string): Promise<User> {
        const user = await this.UsersModule.findOneAndUpdate(
            { _id: userId, role: 'client' }, // Filtro para encontrar el usuario por ID y verificar que sea un cliente
            { $set: { bloked: true } }, // Actualiza el campo bloked a true
            { new: true } // Retorna el documento actualizado
        );

        if (!user) {
            throw new NotFoundException('User not found or not a client');
        }

        return user; // Retorna el usuario actualizado
    }

    async unblockUserById(userId: string): Promise<User> {
        const user = await this.UsersModule.findOneAndUpdate(
            { _id: userId, role: 'client' }, // Filtro para encontrar el usuario por ID y verificar que sea un cliente
            { $set: { bloked: false } }, // Actualiza el campo bloked a false
            { new: true } // Retorna el documento actualizado
        );

        if (!user) {
            throw new NotFoundException('User not found or not a client');
        }

        return user; // Retorna el usuario actualizado
    }




}
