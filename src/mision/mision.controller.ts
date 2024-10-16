import { Body, Controller, Get, Post } from '@nestjs/common';
import { MisionService } from './mision.service';
import { CreateMisionDto } from './dto/create-mision.dto';
import { Mision } from './schema/mision-schema';

@Controller('mision')
export class MisionController {
    constructor(private misionService:MisionService){}

    @Post()
    createMision(@Body() mision:CreateMisionDto){
        return this.misionService.createMision(mision);
    }

    @Get('recent')
    getMostRecentMision():Promise<Mision>{
        return this.misionService.getMostRecentMision()
    }

    @Get()
    getAllMisions(): Promise<Mision[]>{
        return this.misionService.getAllMisions();
    }
}
