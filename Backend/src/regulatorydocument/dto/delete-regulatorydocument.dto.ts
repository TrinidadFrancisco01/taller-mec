import { IsNotEmpty, IsString, IsDate, IsDateString } from 'class-validator';

export class DeleteRegulatoryDocument {
    @IsNotEmpty()
    @IsString()
    documentId: string; // ID del documento a modificar
}
