import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { MisionModule } from './mision/mision.module';
import { VisionModule } from './vision/vision.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/Taller'),
    UsersModule,
    MisionModule,
    VisionModule,
    ],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {}
