
import { Body, Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { CreateRegulatoryDocument } from './dto/create-regulatorydocument.dto';
import { RegulatorydocumentService } from './regulatorydocument.service';
import { UpdateRegulatoryDocument } from './dto/update-regulatorydocument.dto';
import { RegulatoryDocDocument } from './schema/regulatorydocument-schema';
import { DeleteRegulatoryDocument } from './dto/delete-regulatorydocument.dto';


@Controller('regulatorydocument')
export class RegulatorydocumentController {
    constructor(private regulatoryDocumentService: RegulatorydocumentService) { }

    // Endpoint para crear un nuevo documento regulatorio
    @Post('new-regulatory-document')
    async createRegulatoryDocument(@Body() regDoc: CreateRegulatoryDocument): Promise<RegulatoryDocDocument> {
        return this.regulatoryDocumentService.createRegulatoryDocument(regDoc);
    }

    @Post('update-regulatory-document')
    async updateDocument(@Body() updateDoc: UpdateRegulatoryDocument) {
        return this.regulatoryDocumentService.updateRegulatoryDocument(updateDoc);
    }

    @Post('delete-regulatory-document')
    async deleteDocument(@Body() deleteDoc: DeleteRegulatoryDocument) {
        return this.regulatoryDocumentService.deleteRegulatoryDocument(deleteDoc);
    }

    // Endpoint para obtener documentos vigentes
    @Get('active')
    async obtenerDocumentosVigentes(): Promise<RegulatoryDocDocument[]> {
        return this.regulatoryDocumentService.getActiveRegulatoryDocuments();
    }

    //Para obtener todos los documentos
    @Get('documents')
    async obtenerDocumentos(): Promise<RegulatoryDocDocument[]> {
        return this.regulatoryDocumentService.getRegulatoryDocumets();
    }

    @Get('active/privacy-policy')
    async getActivePrivacyPolicies() {
        return this.regulatoryDocumentService.getActivePrivacyPolicyDocuments();
    }

    @Get('active/terms-and-conditions')
    async getActiveTermsAndConditions() {
        return this.regulatoryDocumentService.getActiveTermsAndConditionsDocuments();
    }

    @Get('active/legal-disclaimers')
    async getActiveLegalDisclaimers() {
        return this.regulatoryDocumentService.getActiveLegalDisclaimersDocuments();
    }

    @Get('deleted')
    async getDeletedRegulatoryDocuments() {
        return this.regulatoryDocumentService.getAllDeletedRegulatoryDocuments();
    }

}
