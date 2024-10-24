import { Module } from '@nestjs/common';
import { IncidentmonitorController } from './incidentmonitor.controller';
import { IncidentmonitorService } from './incidentmonitor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from 'src/users/schemas/user-schema';
import { Incident, IncidentSchema } from 'src/users/schemas/incident-schema';

@Module({
  imports:[MongooseModule.forFeature([
    {
      name: User.name,
      schema: UserSchema,
    },
    {
      name: Incident.name,
      schema: IncidentSchema,
    }
  ])],
  controllers: [IncidentmonitorController],
  providers: [IncidentmonitorService]
})
export class IncidentmonitorModule {}
