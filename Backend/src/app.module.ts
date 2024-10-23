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
import { ContactdataModule } from './profilecompany/contactdata/contactdata.module';
import { SloganModule } from './profilecompany/slogan/slogan.module';
import { SocialnetworksModule } from './profilecompany/socialnetworks/socialnetworks.module';
import { TitlepageModule } from './profilecompany/titlepage/titlepage.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/Taller'),
    UsersModule,
    MisionModule,
    VisionModule,
    RegulatorydocumentModule,
    ContactdataModule,
    SloganModule,
    SocialnetworksModule,
    TitlepageModule,
    ],
  controllers: [AppController, HolaController,],
  providers: [AppService],
})
export class AppModule {}
