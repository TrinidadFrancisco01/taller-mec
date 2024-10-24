import { IsNotEmpty, IsString } from "class-validator";

export class CreateTitlePageDto{
    @IsNotEmpty({ message: 'El título no puede estar vacío' }) // Verifica que no esté vacío
    @IsString({ message: 'El título debe ser una cadena de texto' }) // Verifica que sea un string
    title:string
}