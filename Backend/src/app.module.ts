import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { MisionModule } from './mision/mision.module';
import { VisionModule } from './vision/vision.module';
import { HolaController } from './hola/hola.controller';
import { RegulatorydocumentModule } from './regulatorydocument/regulatorydocument.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://trinidad:trinidad2004@cluster0.ivkew.mongodb.net/Taller'),
    UsersModule,
    MisionModule,
    VisionModule,
    RegulatorydocumentModule,
    ],
  controllers: [AppController, HolaController,],
  providers: [AppService],
})
export class AppModule {}
