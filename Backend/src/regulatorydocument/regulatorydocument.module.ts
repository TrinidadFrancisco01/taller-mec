import { Module } from '@nestjs/common';
import { RegulatorydocumentService } from './regulatorydocument.service';
import { RegulatorydocumentController } from './regulatorydocument.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RegulatoryDocument, RegulatoryDocumentSchema } from './schema/regulatorydocument-schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: RegulatoryDocument.name, schema:RegulatoryDocumentSchema}])
  ],
  providers: [RegulatorydocumentService],
  controllers: [RegulatorydocumentController]
})
export class RegulatorydocumentModule {}
