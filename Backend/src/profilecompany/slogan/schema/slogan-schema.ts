import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty, IsString, Length } from "class-validator";
import { Document } from "mongoose";
export type SloganDocument = Slogan & Document
@Schema({
    timestamps:true,
})

export class Slogan{
    @IsNotEmpty()
    @IsString()
    @Length(5, 100, { message: 'El eslogan debe tener entre 5 y 100 caracteres' }) // Límite de 5 a 100 caracteres (validación a nivel DTO)
    @Prop({
        required:true,
        maxlength: 100, // Límite máximo de caracteres a nivel de base de datos
    })
    slogan : string;
}

export const SloganSchema = SchemaFactory.createForClass(Slogan)