import { Module } from '@nestjs/common';
import { ContactdataController } from './contactdata.controller';
import { ContactdataService } from './contactdata.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactData, ContactDataSchema } from './schema/contact-data-schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: ContactData.name, schema: ContactDataSchema}])
  ],
  controllers: [ContactdataController],
  providers: [ContactdataService]
})
export class ContactdataModule {}
