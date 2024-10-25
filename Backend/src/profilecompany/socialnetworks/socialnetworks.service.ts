import { SocialnetworksModule } from './socialnetworks.module';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SocialNetworks, SocialNetworksDocument } from './schema/social-networks-schema';
import { Model } from 'mongoose';
import { CreateSocialNetworkDto } from './dto/create-social-networks.dto';

@Injectable()
export class SocialnetworksService {
    constructor(@InjectModel(SocialNetworks.name) private SocialnetworksModule: Model<SocialNetworksDocument>) { }

    async createSocialNetwork(socialNet: CreateSocialNetworkDto) {
        const socialNetCreated = await this.SocialnetworksModule.create(socialNet);
        return socialNetCreated;
    }

    // Función para editar una red social existente
    async updateSocialNetwork(id: string, updateDto: CreateSocialNetworkDto): Promise<SocialNetworksDocument> {
        const existingSocialNetwork = await this.SocialnetworksModule.findById(id);

        if (!existingSocialNetwork) {
            throw new NotFoundException(`Red social con ID ${id} no encontrada`);
        }

        // Actualizar los campos
        existingSocialNetwork.type = updateDto.type; // Agregado
        existingSocialNetwork.url = updateDto.url;

        // Guardar los cambios
        return existingSocialNetwork.save();
    }


    async deleteSocialNetwork(id: string): Promise<string> {
        const result = await this.SocialnetworksModule.findByIdAndDelete(id);

        if (!result) {
            throw new NotFoundException(`Red social con ID ${id} no encontrada`);
        }

        return `Red social con ID ${id} eliminada correctamente.`;
    }

    // Función para obtener la red social más reciente de cualquier tipo
    async getMostRecentSocialNetwork(): Promise<SocialNetworksDocument | null> {
        return await this.SocialnetworksModule
            .findOne() // No filtramos por tipo
            .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
            .exec();
    }


    // Función para obtener la red social más reciente de Facebook
    async getMostRecentFacebook(): Promise<SocialNetworksDocument | null> {
        return await this.SocialnetworksModule
            .findOne({ type: 'Facebook' })
            .sort({ createdAt: -1 })
            .exec();
    }

    // Función para obtener la red social más reciente de Twitter
    async getMostRecentTwitter(): Promise<SocialNetworksDocument | null> {
        return await this.SocialnetworksModule
            .findOne({ type: 'Twitter' })
            .sort({ createdAt: -1 })
            .exec();
    }

    // Función para obtener la red social más reciente de Instagram
    async getMostRecentInstagram(): Promise<SocialNetworksDocument | null> {
        return await this.SocialnetworksModule
            .findOne({ type: 'Instagram' })
            .sort({ createdAt: -1 })
            .exec();
    }

    // Función para obtener la red social más reciente de LinkedIn
    async getMostRecentLinkedIn(): Promise<SocialNetworksDocument | null> {
        return await this.SocialnetworksModule
            .findOne({ type: 'LinkedIn' })
            .sort({ createdAt: -1 })
            .exec();
    }

    // Función para obtener la red social más reciente de YouTube
    async getMostRecentYouTube(): Promise<SocialNetworksDocument | null> {
        return await this.SocialnetworksModule
            .findOne({ type: 'YouTube' })
            .sort({ createdAt: -1 })
            .exec();
    }

    // Función para obtener la red social más reciente de TikTok
    async getMostRecentTikTok(): Promise<SocialNetworksDocument | null> {
        return await this.SocialnetworksModule
            .findOne({ type: 'TikTok' })
            .sort({ createdAt: -1 })
            .exec();
    }

}
