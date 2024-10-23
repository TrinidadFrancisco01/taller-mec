import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSocialNetworkDto {
    @IsNotEmpty()
    @IsString()
    plataform: string; // Nombre de la red social (ej: Facebook)

    @IsNotEmpty()
    @IsUrl({}, { message: 'La URL debe ser válida' }) // Validación de URL
    url: string; // Enlace a la red social
}
