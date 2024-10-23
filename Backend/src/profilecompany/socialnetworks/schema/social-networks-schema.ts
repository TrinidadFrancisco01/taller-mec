import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { IsNotEmpty, IsString, IsUrl, } from "class-validator";
import { Document } from "mongoose";
export type SocialNetworksDocument = SocialNetworks & Document;
@Schema({
    timestamps:true,
})
export class SocialNetworks {
    @IsNotEmpty() // Valida que el campo no esté vacío
    @IsString() // Valida que sea una cadena
    @Prop({
        required:true
    })
    plataform: string;

    @IsNotEmpty() // Valida que el campo no esté vacío
    @IsUrl({}, { message: 'La URL debe ser válida' }) // Valida que sea una URL
    @Prop({
        required:true
    })
    url: string;
}

export const SocialNetworksSchema = SchemaFactory.createForClass(SocialNetworks);