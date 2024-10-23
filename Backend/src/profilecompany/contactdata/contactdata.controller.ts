import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ContactdataService } from './contactdata.service';
import { CreateContactDataDto } from './dto/create-contact-data.dto';

@Controller('contactdata')
export class ContactdataController {
    constructor(private contactDatService: ContactdataService){}

    @Post('new-contactdata')
    createContactData(@Body() contactDat: CreateContactDataDto){
        return this.contactDatService.createContactData(contactDat);
    }

    @Put('update-contactdata/:id')
    updateContactData(
        @Param('id') id:string,
        @Body() updateDto: CreateContactDataDto,
    ){
        return this.contactDatService.updateContactData(id, updateDto);
    }
}
