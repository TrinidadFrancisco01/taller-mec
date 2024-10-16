import { Body, Controller, Get, Post } from '@nestjs/common';
import { MisionService } from 'src/mision/mision.service';
import { CreateVisionDto } from './dto/create-vision.dto';
import { Vision } from './schema/vision-schema';
import { VisionService } from './vision.service';

@Controller('vision')
export class VisionController {
    constructor(private visionService:VisionService){}

    @Post()
    createVision(@Body() vision: CreateVisionDto){
        return this.visionService.createVision(vision);
    }

    @Get('recent')
    getMostRecentVision(): Promise<Vision>{
        return this.visionService.getMostRecentVision();
    }

    @Get()
    getAllVisions():Promise<Vision[]>{
        return this.visionService.getAllVisions();
    }
}
