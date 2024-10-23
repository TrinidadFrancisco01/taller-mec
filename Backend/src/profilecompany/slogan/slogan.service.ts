import { SloganModule } from './slogan.module';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Slogan, SloganDocument } from './schema/slogan-schema';
import { Model } from 'mongoose';
import { CreateSloganDto } from './dto/create-slogan.dto';

@Injectable()
export class SloganService {
    constructor(@InjectModel(Slogan.name) private SloganModule: Model<SloganDocument>){}

    async createSlogan(slogan: CreateSloganDto){
        const sloganCreated = await this.SloganModule.create(slogan);
        return sloganCreated;
    }

    async updateSlogan(id: string,updateDto: CreateSloganDto):Promise<SloganDocument>{
        const existingSlogan = await this.SloganModule.findById(id);
        if(!existingSlogan){
            throw new NotFoundException(`Slogan con ID ${id} no encontrado`);
        }
         existingSlogan.slogan = updateDto.slogan;

        return existingSlogan.save();
    }
}