import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ConfigureDocument = Configure & Document
@Schema({
    timestamps: true,
})

export class Configure {
    @Prop({ required: true })
    intent: number;

    @Prop({ required: true })
    tokenLifetime: number; // Tiempo de vida de los tokens en segundos

    @Prop({ required: true })
    verificationEmailTitle: string; // Título del correo de verificación

    @Prop({ required: true })
    verificationEmailGreeting: string; // Saludo para el correo de verificación

    @Prop({ required: true })
    verificationEmailFarewell: string; // Despedida para el correo de verificación
}

export const ConfigureSchema = SchemaFactory.createForClass(Configure)