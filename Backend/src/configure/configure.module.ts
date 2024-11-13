import { Module } from '@nestjs/common';
import { ConfigureService } from './configure.service';
import { ConfigureController } from './configure.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Configure, ConfigureSchema } from './schema/configure-schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: Configure.name, schema: ConfigureSchema}])
  ],
  providers: [ConfigureService],
  controllers: [ConfigureController]
})
export class ConfigureModule {}
