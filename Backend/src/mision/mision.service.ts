import { Injectable } from '@nestjs/common';
import { CreateMisionDto } from './dto/create-mision.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Mision, MisionDocument } from './schema/mision-schema';
import { Model } from 'mongoose';

@Injectable()
export class MisionService {
    constructor(@InjectModel(Mision.name) private  misionModule: Model<MisionDocument>,){}

    async createMision(mision: CreateMisionDto){
        console.log(mision);
        const misionCreated = await this.misionModule.create(mision);
        return misionCreated;
    }

    async getMostRecentMision():Promise<Mision> {
        return  this.misionModule.findOne().sort({createdAt: -1}).exec();
    }

    async getAllMisions(): Promise<Mision[]>{
        return this.misionModule.find().exec();
    }
}
