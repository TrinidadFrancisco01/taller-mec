import { Module } from '@nestjs/common';
import { SloganController } from './slogan.controller';
import { SloganService } from './slogan.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Slogan, SloganSchema } from './schema/slogan-schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    MongooseModule.forFeature([{name: Slogan.name, schema:SloganSchema}]),
  ],
  controllers: [SloganController],
  providers: [SloganService, ]
})
export class SloganModule {}
