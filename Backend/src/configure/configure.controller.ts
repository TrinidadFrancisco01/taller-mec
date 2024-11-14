import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ConfigureService } from './configure.service';
import { CreateConfigureDto } from './dto/configure.dto';
import { Configure } from './schema/configure-schema';

@Controller('configure')
export class ConfigureController {
    constructor(private configureService: ConfigureService) { }

   /* @Post()
    createIntent(@Body() configure: CreateConfigureDto) {
        // Convertir minutos a segundos para tokenLifetime
        const configureData = {
            ...configure,
            tokenLifetime: configure.tokenLifetime * 60000 // Multiplica minutos por 60 para convertir a segundos
        };

        return this.configureService.createConfig(configureData);
    }
*/
    @Get()
    async getMostRecentConfig(): Promise<Configure> {
        const config = await this.configureService.getMostRecentConfig();

        // Convertir tokenLifetime de milisegundos a minutos
        if (config) {
            config.tokenLifetime = config.tokenLifetime / 60000; // Convierte milisegundos a minutos
        }

        return config;
    }

    @Patch(':id')
    updateConfig(
        @Param('id') id: string,
        @Body() configureDto: CreateConfigureDto
    ): Promise<Configure> {
        // Convertir minutos a segundos para tokenLifetime
        const configureData = {
            ...configureDto,
            tokenLifetime: configureDto.tokenLifetime * 60000 // Multiplica minutos por 60,000 para convertir a milisegundos
        };

        return this.configureService.updateConfig(id, configureData);
    }

}
