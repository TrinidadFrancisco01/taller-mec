import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SocialnetworksService } from './socialnetworks.service';
import { CreateSocialNetworkDto } from './dto/create-social-networks.dto';
import { SocialNetworksDocument, SocialNetworks } from './schema/social-networks-schema';

@Controller('socialnetworks')
export class SocialnetworksController {
    constructor(private socialNetService: SocialnetworksService) { }

    @Post('new-social')
    async create(@Body() createSocialNetworkDto: CreateSocialNetworkDto) {
        return this.socialNetService.createSocialNetwork(createSocialNetworkDto);
    }

    @Put('update-social/:id')
    async update(@Param('id') id: string, @Body() updateSocialNetworkDto: CreateSocialNetworkDto) {
        return this.socialNetService.updateSocialNetwork(id, updateSocialNetworkDto);
    }

    @Delete('delete-social/:id')
    async delete(@Param('id') id: string) {
        await this.socialNetService.deleteSocialNetwork(id);
        return { message: `Red social con ID ${id} eliminada correctamente.` };
    }

    // Funciones para obtener la red social más reciente de cada plataforma
    @Get('most-recent/facebook')
    async getMostRecentFacebook(): Promise<SocialNetworksDocument | null> {
        return this.socialNetService.getMostRecentFacebook();
    }

    @Get('most-recent/twitter')
    async getMostRecentTwitter(): Promise<SocialNetworksDocument | null> {
        return this.socialNetService.getMostRecentTwitter();
    }

    @Get('most-recent/instagram')
    async getMostRecentInstagram(): Promise<SocialNetworksDocument | null> {
        return this.socialNetService.getMostRecentInstagram();
    }

    @Get('most-recent/linkedin')
    async getMostRecentLinkedIn(): Promise<SocialNetworksDocument | null> {
        return this.socialNetService.getMostRecentLinkedIn();
    }

    @Get('most-recent/youtube')
    async getMostRecentYouTube(): Promise<SocialNetworksDocument | null> {
        return this.socialNetService.getMostRecentYouTube();
    }

    @Get('most-recent/tiktok')
    async getMostRecentTikTok(): Promise<SocialNetworksDocument | null> {
        return this.socialNetService.getMostRecentTikTok();
    }

}
