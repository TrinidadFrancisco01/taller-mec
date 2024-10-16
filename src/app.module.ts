import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { MisionModule } from './mision/mision.module';
import { MisMisModule } from './mis-mis/mis-mis.module';
import { MisVisModule } from './mis-vis/mis-vis.module';
import { ObjetivosController } from './objetivos/objetivos.controller';
import { ObjetivosModule } from './objetivos/objetivos.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/Taller'),
    UsersModule,
    MisionModule,
    MisMisModule,
    MisVisModule,
    ObjetivosModule],
  controllers: [AppController, ObjetivosController],
  providers: [AppService],
})
export class AppModule {}
