
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SocialnetworksController } from './socialnetworks.controller';
import { SocialnetworksService } from './socialnetworks.service';
import { SocialNetworks, SocialNetworksSchema } from './schema/social-networks-schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: SocialNetworks.name, schema:SocialNetworksSchema}])
  ],
  controllers: [SocialnetworksController],
  providers: [SocialnetworksService]
})
export class SocialnetworksModule {}
