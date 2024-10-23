import { Module } from '@nestjs/common';
import { TitlepageController } from './titlepage.controller';
import { TitlepageService } from './titlepage.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TitlePage, TitlePageSchema } from './schema/title-page-schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: TitlePage.name, schema:TitlePageSchema}])
  ],
  controllers: [TitlepageController],
  providers: [TitlepageService]
})
export class TitlepageModule {}
