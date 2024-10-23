import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ContactDataDocument = ContactData & Document;

@Schema({
    timestamps:true,
})

export class ContactData{
    @Prop({ required: true, type: String })
    direccion: string;

    @Prop({ required: true, type: String, unique: true })
    correo: string;

    @Prop({ required: true, type: String })
    telefono: string;
}

export const ContactDataSchema = SchemaFactory.createForClass(ContactData)