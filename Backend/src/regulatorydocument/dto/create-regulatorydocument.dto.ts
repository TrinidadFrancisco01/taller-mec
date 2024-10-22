import { IsNotEmpty, IsString, IsDate, IsIn } from 'class-validator';

export class CreateRegulatoryDocument {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsDate()
    expirationDate: Date;

    @IsNotEmpty()
    @IsString()
    @IsIn(['Política de privacidad', 'Términos y condiciones', 'Deslinde legal']) // Restricción de tipos válidos
    documentType: string; // Nuevo campo para diferenciar el tipo de documento
}
