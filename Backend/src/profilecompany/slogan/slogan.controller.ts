import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { SloganService } from './slogan.service';
import { CreateSloganDto } from './dto/create-slogan.dto';

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
}
