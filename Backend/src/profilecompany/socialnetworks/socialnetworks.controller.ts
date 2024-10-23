import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { SocialnetworksService } from './socialnetworks.service';
import { CreateSocialNetworkDto } from './dto/create-social-networks.dto';

@Controller('socialnetworks')
export class SocialnetworksController {
    constructor(private socialNetService: SocialnetworksService) { }

    @Post('new-social')
    createSocialNetwork(@Body() socialNet: CreateSocialNetworkDto) {
        return this.socialNetService.createSocialNetwork(socialNet);
    }

    @Put('update-social/:id')
    updateSocialNetwork(
        @Param('id') id: string,
        @Body() updateDto: CreateSocialNetworkDto,
    ) {
        return this.socialNetService.updateSocialNetwork(id, updateDto);
    }

    @Delete('delete-social/:id')
    deleteSocialNetwork(@Param('id') id: string) {
        return this.socialNetService.deleteSocialNetwork(id);
    }
}
