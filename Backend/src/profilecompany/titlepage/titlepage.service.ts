import { IsString } from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TitlePage, TitlepageDocument } from './schema/title-page-schema';
import { Model } from 'mongoose';
import { CreateTitlePageDto } from './dto/create-title-page.dto';

@Injectable()
export class TitlepageService {
    constructor(@InjectModel(TitlePage.name) private titlePageModule: Model<TitlepageDocument>,){}

    async createTitlePage(titlepage: CreateTitlePageDto){
        console.log(titlepage);
        const titlePageCreated = await this.titlePageModule.create(titlepage);
        return titlePageCreated;
    }
    async getMostRecentTitlePage():Promise<TitlePage>{
        return this.titlePageModule.findOne().sort({createdAt: -1}).exec();
    }

    async updateTitle(id: string, updateDto: CreateTitlePageDto){
        const existingTitle = await this.titlePageModule.findById(id);
        if(!existingTitle){
            throw new NotFoundException(`El titolo con el ID: ${id}, no fue encontrado`);
        }

        existingTitle.title= updateDto.title;

        return existingTitle.save();
    }


}
