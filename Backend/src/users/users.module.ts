import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user-schema';
import { Incident, IncidentSchema } from './schemas/incident-schema';
import { Configure, ConfigureSchema } from 'src/configure/schema/configure-schema';
@Module({
  imports: [MongooseModule.forFeature([
    {
      name: User.name,
      schema: UserSchema,
    },
    ,
    {
      name: Incident.name,  // Agrega el modelo de incidencias
      schema: IncidentSchema,
    },
    {
      name: Configure.name,
      schema: ConfigureSchema
    },
  ])],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }
