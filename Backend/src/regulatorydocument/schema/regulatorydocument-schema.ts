import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RegulatoryDocDocument = RegulatoryDocument & Document;

@Schema({
    timestamps: true,
})
export class RegulatoryDocument {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    expirationDate: Date;

    @Prop({ required: true, enum: ['Política de privacidad', 'Términos y condiciones', 'Deslinde legal'] })
    documentType: string;

    @Prop({ required: true, default: 1 }) // Campo de versión
    version: number;

    @Prop({ required: true, enum: ['vigente', 'no vigente'], default: 'vigente' }) // Campo de estado
    estado: string; // Estado del documento

    @Prop({ required: true, default: false }) // Campo de eliminación
    eliminada: boolean; // Indica si el documento ha sido eliminado
}

export const RegulatoryDocumentSchema = SchemaFactory.createForClass(RegulatoryDocument);
