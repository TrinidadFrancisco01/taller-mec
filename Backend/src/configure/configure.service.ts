import { Injectable, NotFoundException } from '@nestjs/common';
import { Configure, ConfigureDocument } from './schema/configure-schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateConfigureDto } from './dto/configure.dto';

@Injectable()
export class ConfigureService {
    constructor(@InjectModel(Configure.name) private configureModel: Model<ConfigureDocument>,){}

    async createConfig(configure: CreateConfigureDto){
        console.log(configure);
        const intentCreated= await this.configureModel.create(configure)
        return intentCreated;
    }

    async getMostRecentConfig(){
        return this.configureModel.findOne().sort({createdAt: -1}).exec();
    }

    async updateConfig(id: string, configureDto: CreateConfigureDto) {
        const updatedConfig = await this.configureModel.findByIdAndUpdate(
            id,
            configureDto,
            { new: true } // Retorna el documento actualizado
        );

        if (!updatedConfig) {
            throw new NotFoundException(`Configuración con ID ${id} no encontrada`);
        }

        return updatedConfig;
    }

}
