import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { IsIn, IsNotEmpty, IsString, IsUrl, } from "class-validator";
import { Document } from "mongoose";
export type SocialNetworksDocument = SocialNetworks & Document;
@Schema({
    timestamps:true,
})
export class SocialNetworks {
    @IsNotEmpty() // Valida que el campo no esté vacío
    @IsIn(['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok'], {
        message: 'El tipo de plataforma debe ser uno de los siguientes: Facebook, Twitter, Instagram, LinkedIn, YouTube, TikTok',
    })
    @Prop({
        required: true,
    })
    type: string; // Tipo de red social (ej: Facebook)


    @IsNotEmpty() // Valida que el campo no esté vacío
    @IsUrl({}, { message: 'La URL debe ser válida' }) // Valida que sea una URL
    @Prop({
        required: true,
    })
    url: string; // Enlace a la red social
}

export const SocialNetworksSchema = SchemaFactory.createForClass(SocialNetworks);