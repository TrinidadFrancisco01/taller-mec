import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVisionDto } from './dto/create-vision.dto';
import { Vision, VisionDocument } from './schema/vision-schema';

@Injectable()
export class VisionService {
    constructor(@InjectModel(Vision.name) private visionModule: Model<VisionDocument> ){}

    async createVision(vision: CreateVisionDto){
        console.log(vision);
        const visionCreated = await this.visionModule.create(vision);
        return visionCreated;
    }

    async getMostRecentVision(): Promise<Vision> {
        return this.visionModule.findOne().sort({createdAt: -1}).exec();
    }

    async getAllVisions(): Promise<Vision[]>{
        return this.visionModule.find().exec();
    }
}
