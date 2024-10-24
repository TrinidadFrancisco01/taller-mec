import { ContactdataModule } from './contactdata.module';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ContactData, ContactDataDocument } from './schema/contact-data-schema';
import { Model } from 'mongoose';
import { CreateContactDataDto } from './dto/create-contact-data.dto';
import { create } from 'domain';

@Injectable()
export class ContactdataService {
    constructor(@InjectModel(ContactData.name) private ContactdataModule: Model<ContactDataDocument>){}

    async createContactData(contactData: CreateContactDataDto){
        const contactDataCreated = await this.ContactdataModule.create(contactData);
        return contactDataCreated;
    }

    async updateContactData(id:string, updateDto: CreateContactDataDto): Promise<ContactDataDocument>{
        const existingContactData = await this.ContactdataModule.findById(id);
        if(!existingContactData){
            throw new NotFoundException(`Red social con ID ${id} no encontrada`)
        }
        existingContactData.direccion = updateDto.direccion;
        existingContactData.correo= updateDto.correo;
        existingContactData.telefono= updateDto.telefono;

        return existingContactData.save();
    }

    async getMostRecentContact(): Promise<ContactData>{
        return this.ContactdataModule.findOne().sort({createdAt:-1}).exec();
    }

    // Nueva función para traer todos los documentos
    async getAllContacts(): Promise<ContactData[]> {
        return this.ContactdataModule.find().exec();  // Trae todos los documentos
    }
}
