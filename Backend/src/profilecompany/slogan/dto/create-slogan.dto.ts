import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateSloganDto{
    @IsNotEmpty()
    @IsString()
    @Length(5, 100, { message: 'El eslogan debe tener entre 5 y 100 caracteres' }) // Límite de 5 a 100 caracteres
    slogan: string;
}