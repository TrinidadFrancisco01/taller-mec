import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { MisionService } from './mision.service';
import { MisionController } from './mision.controller';
import { Mongoose } from 'mongoose';
import { Mision, MisionSchema } from './schema/mision-schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: Mision.name, schema:MisionSchema}])
  ],
  providers: [MisionService],
  controllers: [MisionController]
})
export class MisionModule {}
