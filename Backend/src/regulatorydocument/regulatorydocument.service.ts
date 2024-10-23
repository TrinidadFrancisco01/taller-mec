import { UpdateRegulatoryDocument } from './dto/update-regulatorydocument.dto';
import { BadRequestException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { RegulatoryDocDocument, RegulatoryDocument } from './schema/regulatorydocument-schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRegulatoryDocument } from './dto/create-regulatorydocument.dto';
import { DeleteRegulatoryDocument } from './dto/delete-regulatorydocument.dto';

@Injectable()
export class RegulatorydocumentService {
    constructor(
        @InjectModel(RegulatoryDocument.name) private regulatoryDocumentModel: Model<RegulatoryDocDocument>,
    ) { }

    async createRegulatoryDocument(regDoc: CreateRegulatoryDocument): Promise<RegulatoryDocDocument> {
        // Busca el último documento del mismo tipo y estado "vigente"
        const lastDocument = await this.regulatoryDocumentModel
            .findOne({
                documentType: regDoc.documentType,
                eliminada: false,
                estado: "vigente" // Asegúrate de filtrar por estado vigente
            })
            .sort({ version: -1 }); // Ordenar por versión descendente

        // Si hay un documento previo, actualiza su estado a "no vigente"
        if (lastDocument) {
            await this.regulatoryDocumentModel.updateOne(
                { _id: lastDocument._id }, // Filtrar por ID del documento anterior
                { $set: { estado: "no vigente" } } // Actualizar el estado
            );
        }

        // Si no hay documento previo, la nueva versión empezará en 1
        const newVersion = lastDocument ? lastDocument.version + 1 : 1;

        // Crea el nuevo documento regulatorio
        const regulatoryDocumentCreated = new this.regulatoryDocumentModel({
            ...regDoc,
            version: newVersion, // Asigna la nueva versión
            estado: "vigente", // Asegúrate de establecer el estado de la nueva versión
            eliminada: false // Asegúrate de que el nuevo documento no esté eliminado
        });

        return regulatoryDocumentCreated.save();
    }

    async updateRegulatoryDocument(updateDoc: UpdateRegulatoryDocument): Promise<RegulatoryDocDocument> {
        const existingDoc = await this.regulatoryDocumentModel.findById(updateDoc.documentId);

        if (!existingDoc) {
            throw new NotFoundException('Documento regulatorio no encontrado');
        }

        // Marcar el documento existente como no vigente
        existingDoc.estado = "no vigente";
        await existingDoc.save();

        // Crear un nuevo documento regulatorio con la nueva versión
        const newRegulatoryDocument = new this.regulatoryDocumentModel({
            title: updateDoc.title,
            description: updateDoc.description,
            expirationDate: new Date(updateDoc.expirationDate),
            documentType: existingDoc.documentType,
            version: existingDoc.version + 1, // Incrementar la versión
            estado: "vigente",
            eliminada: false
        });

        return newRegulatoryDocument.save();
    }

    async deleteRegulatoryDocument(deleteDoc: DeleteRegulatoryDocument): Promise<RegulatoryDocDocument> {
        const existingDoc = await this.regulatoryDocumentModel.findById(deleteDoc.documentId)
        if (!existingDoc) {
            throw new NotFoundException('Documento regulatorio no encontrado')
        }

        //Marcar el documento existente como eliminado
        existingDoc.eliminada = true;

        return await existingDoc.save();

    }

    async getActiveRegulatoryDocuments(): Promise<RegulatoryDocDocument[]> {
        return this.regulatoryDocumentModel.find({ estado: "vigente" }).exec();
    }

    async getActiveRegulatoryDocumentsByType(documentType: string): Promise<RegulatoryDocDocument[]> {
        // Verificar que el tipo de documento sea válido
        const validDocumentTypes = ['Política de privacidad', 'Términos y condiciones', 'Deslinde legal'];

        if (!validDocumentTypes.includes(documentType)) {
            throw new BadRequestException('Tipo de documento no válido');
        }

        // Buscar documentos regulatorios vigentes del tipo especificado
        return this.regulatoryDocumentModel.find({ estado: "vigente", documentType }).exec();
    }

    async getRegulatoryDocumets(): Promise<RegulatoryDocDocument[]>{
        return this.regulatoryDocumentModel.find().exec();
    }


    async getActivePrivacyPolicyDocuments(): Promise<RegulatoryDocDocument[]> {
        return this.getActiveRegulatoryDocumentsByType('Política de privacidad');
    }

    async getActiveTermsAndConditionsDocuments(): Promise<RegulatoryDocDocument[]> {
        return this.getActiveRegulatoryDocumentsByType('Términos y condiciones');
    }

    async getActiveLegalDisclaimersDocuments(): Promise<RegulatoryDocDocument[]> {
        return this.getActiveRegulatoryDocumentsByType('Deslinde legal');
    }


    async getAllDeletedRegulatoryDocuments(): Promise<RegulatoryDocDocument[]> {
        // Buscar todos los documentos regulatorios que estén eliminados
        return this.regulatoryDocumentModel.find({ eliminada: true }).exec();
    }





}
