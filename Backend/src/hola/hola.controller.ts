import { Controller, Get } from '@nestjs/common';

@Controller('hola')
export class HolaController {
    @Get()
    hola(){
        return 'hola mundo!'
    }
}
