import { ImagesModule } from './images.module';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Images } from './interface/images.interface';
import { ImagesDto } from './dto/images-dto/images-dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImagesService {
    constructor(@InjectModel('Images') private imagesModel: Model<Images>) { }

    /*async uploadFile(filename: ImagesDto){
        const file = new this.imagesModel(filename);
        return await file.save();
    }*/

    async uploadFile(imageData: { filename: string; data: Buffer; contentType: string }) {
        const file = new this.imagesModel(imageData);  // Crear el documento con datos binarios y tipo MIME
        return await file.save();
    }



    // Método para recuperar la imagen por ID
    async getImageById(id: string): Promise<Images> {
        const image = await this.imagesModel.findById(id).exec();
        if (!image) {
            throw new NotFoundException('Imagen no encontrada');
        }
        return image;
    }

    // Método para obtener la imagen más reciente
    async getLatestImage() {
        return await this.imagesModel
            .findOne()
            .sort({ createdAt: -1 })  // Ordena por fecha de creación, descendente
            .exec();
    }


    // service.ts
    async updateFile(id: string, imageData: { filename: string; data: Buffer; contentType: string }) {
        const file = await this.imagesModel.findById(id); // Buscar el archivo por ID

        if (!file) {
            throw new Error("File not found"); // Lanzar error si no se encuentra
        }

        // Actualizar los campos del archivo
        file.filename = imageData.filename;
        file.data = imageData.data;
        file.contentType = imageData.contentType;

        return await file.save(); // Guardar cambios en la base de datos
    }


}
