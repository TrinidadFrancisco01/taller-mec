import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TitlepageService } from './titlepage.service';
import { CreateTitlePageDto } from './dto/create-title-page.dto';
import { TitlePage } from './schema/title-page-schema';

@Controller('titlepage')
export class TitlepageController {
    constructor(private titlePageService:TitlepageService){}

    @Post('new-title-page')
    createTitlePage(@Body() titlepage: CreateTitlePageDto){
        return this.titlePageService.createTitlePage(titlepage);
    }

    @Get('recent')
    getMostRecentTitlePage():Promise<TitlePage>{
        return this.titlePageService.getMostRecentTitlePage();
    }

    @Put('update-title/:id')
    updateTitle(
        @Param('id') id:string,
        @Body() updateDto: CreateTitlePageDto
    ){
        return this.titlePageService.updateTitle(id, updateDto);
    }
}
