import { Controller, Get, Param, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, renameImage } from './helper/imagenes.helper';
import { ImagesService } from './images.service';
import path from 'path';
import { ImagesDto } from './dto/images-dto/images-dto';
import * as crypto from 'crypto';
import { Response } from 'express';


@Controller('images')
export class ImagesController {

    constructor(private readonly imagesService: ImagesService) { }

    /*@Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    UploadedFile(@UploadedFile() file:Express.Multer.File){
        console.log(file);
    }*/

    /*@Post('upload')
    @UseInterceptors(FileInterceptor('file',{
        storage:diskStorage({
            destination:'./upload',
            filename: renameImage
        }),
        fileFilter: fileFilter
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);

        return await this.imagesService.uploadFile({filename: file.filename});
    }*/

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {

        fileFilter: fileFilter,  // Filtro para tipos de archivos (puedes definir un `fileFilter` si es necesario)
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
        // Extrae el contenido binario (buffer) y el tipo de contenido (mimetype)
        const { buffer, mimetype } = file;
        console.log(buffer);

        // Llamar al servicio para guardar la imagen en la base de datos
        return await this.imagesService.uploadFile({
            filename: file.filename,   // Nombre del archivo
            data: buffer,              // Los datos binarios de la imagen
            contentType: mimetype,     // Tipo de contenido (ej. "image/jpeg")
        });
    }


    // Endpoint para obtener la imagen más reciente
    @Get('latest')
    async getLatestImage(@Res() res: Response) {
        const image = await this.imagesService.getLatestImage();

        if (!image) {
            return res.status(404).send('No image found');
        }

        res.setHeader('Content-Type', image.contentType);
        return res.send(image.data);  // Devuelve los datos binarios de la imagen
    }

    @Get(':id')
    async getImageById(@Param('id') id: string, @Res() res: Response) {
        const image = await this.imagesService.getImageById(id); // Suponiendo que tienes este método
        res.setHeader('Content-Type', image.contentType);
        res.send(image.data);
    }


    @Put('update/:id')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: fileFilter, // Puedes definir un `fileFilter` para tipos específicos
    }))
    async updateFile(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new Error("File not provided"); // Manejo de error si no hay archivo
        }

        // Extrae el contenido binario (buffer) y el tipo de contenido (mimetype)
        const { buffer, mimetype } = file;

        // Llamar al servicio para actualizar la imagen en la base de datos
        return await this.imagesService.updateFile(id, {
            filename: file.originalname,  // Usar el nombre original del archivo
            data: buffer,                 // Los datos binarios de la imagen
            contentType: mimetype,        // Tipo de contenido (ej. "image/jpeg")
        });
    }
}
