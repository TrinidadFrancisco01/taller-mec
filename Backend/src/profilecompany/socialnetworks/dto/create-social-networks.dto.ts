import { IsNotEmpty, IsString, IsUrl, IsIn } from 'class-validator';

export class CreateSocialNetworkDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube', 'TikTok'], {
        message: 'El tipo de plataforma debe ser una de las siguientes: Facebook, Twitter, Instagram, LinkedIn, YouTube, TikTok',
    })
    type: string; // Tipo de red social (ej: Facebook, Twitter, etc.)

    @IsNotEmpty()
    @IsString()
    platform: string; // Nombre de la red social (ej: Página de Facebook)

    @IsNotEmpty()
    @IsUrl({}, { message: 'La URL debe ser válida' }) // Validación de URL
    url: string; // Enlace a la red social
}
