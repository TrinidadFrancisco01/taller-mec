import { IsNotEmpty, IsString, IsDate, IsDateString } from 'class-validator';

export class UpdateRegulatoryDocument {
    @IsNotEmpty()
    @IsString()
    documentId: string; // ID del documento a modificar

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsDateString()
    expirationDate: string;

    @IsNotEmpty()
    @IsString()
    documentType: string;
}
