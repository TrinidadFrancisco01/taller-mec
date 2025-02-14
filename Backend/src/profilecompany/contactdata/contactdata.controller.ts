import { Body, Controller, Get, Param, Post, Put, Req, Res, UnauthorizedException } from '@nestjs/common';
import { ContactdataService } from './contactdata.service';
import { CreateContactDataDto } from './dto/create-contact-data.dto';
import { ContactData } from './schema/contact-data-schema';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken'; // Asegúrate de tener jsonwebtoken instalado.

@Controller('contactdata')
export class ContactdataController {
    constructor(private contactDatService: ContactdataService){}

    @Post('new-contactdata')
    createContactData(@Body() contactDat: CreateContactDataDto){
        return this.contactDatService.createContactData(contactDat);
    }

    @Put('update-contactdata/:id')
    updateContactData(
        @Param('id') id:string,
        @Body() updateDto: CreateContactDataDto,
    ){
        return this.contactDatService.updateContactData(id, updateDto);
    }

    @Get('recent')
    getMostRecentContact(): Promise<ContactData>{
        return this.contactDatService.getMostRecentContact();
    }

    // Endpoint para obtener todos los documentos de la base de datos
    @Get('all')
    async getAllContacts(): Promise<ContactData[]> {
        return this.contactDatService.getAllContacts();
    }
}
