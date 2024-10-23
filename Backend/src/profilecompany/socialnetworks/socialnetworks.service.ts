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
        existingSocialNetwork.plataform = updateDto.plataform;
        existingSocialNetwork.url = updateDto.url;

        // Guardar los cambios
        return existingSocialNetwork.save();
    }

    // Función para eliminar una red social por ID
    async deleteSocialNetwork(id: string): Promise<void> {
        const result = await this.SocialnetworksModule.findByIdAndDelete(id);

        if (!result) {
            throw new NotFoundException(`Red social con ID ${id} no encontrada`);
        }
    }
}
