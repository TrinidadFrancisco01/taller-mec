import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SloganService } from './slogan.service';
import { CreateSloganDto } from './dto/create-slogan.dto';
import { Slogan } from './schema/slogan-schema';

@Controller('slogan')
export class SloganController {
    constructor(private sloganService: SloganService){}

    @Post('new-slogan')
    createSlogan(@Body() slogan: CreateSloganDto){
        return this.sloganService.createSlogan(slogan);
    }

    @Put('update-slogan/:id')
    updateSlogan(
        @Param('id') id:string,
        @Body() updateDto: CreateSloganDto,
    ){
        return this.sloganService.updateSlogan(id,updateDto);
    }


    @Get('recent')
    getAllMostRecentSlogan():Promise<Slogan>{
        return this.sloganService.getMostRecentSlogan();
    }
}
