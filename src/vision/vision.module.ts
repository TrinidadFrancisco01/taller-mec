import { Module } from '@nestjs/common';
import { VisionController } from './vision.controller';
import { VisionService } from './vision.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vision, VisionSchema } from './schema/vision-schema';


@Module({
  imports:[
    MongooseModule.forFeature([{name: Vision.name, schema: VisionSchema}])
  ],
  controllers: [VisionController],
  providers: [VisionService]
})
export class VisionModule {}
