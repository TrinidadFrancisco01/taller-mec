import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateConfigureDto {
    // Número de intentos de acceso
    @IsInt({ message: 'Intent debe ser un número entero' })
    @Min(1, { message: 'Intent debe ser al menos 1' })
    intent: number;

    // Tiempo de vida de los tokens en segundos
    @IsInt({ message: 'TokenLifetime debe ser un número entero' })
    @Min(1, { message: 'TokenLifetime debe ser al menos 1 segundo' })
    tokenLifetime: number;

    // Título para el correo de verificación
    @IsString({ message: 'VerificationEmailTitle debe ser un texto' })
    @IsNotEmpty({ message: 'VerificationEmailTitle no debe estar vacío' })
    verificationEmailTitle: string;

    // Saludo para el correo de verificación
    @IsString({ message: 'VerificationEmailGreeting debe ser un texto' })
    @IsNotEmpty({ message: 'VerificationEmailGreeting no debe estar vacío' })
    verificationEmailGreeting: string;

     // Despedida para el correo de verificación
     @IsString({ message: 'VerificationEmailFarewell debe ser un texto' })
     @IsNotEmpty({ message: 'VerificationEmailFarewell no debe estar vacío' })
     verificationEmailFarewell: string;
}
