import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, max, MaxLength, maxLength, MinLength } from "class-validator";

export class CreateContactDataDto{
    @IsNotEmpty()
    @IsString()
    direccion: string;

    @IsNotEmpty()
    @IsEmail()
    correo: string;

    @IsNotEmpty()
    @IsPhoneNumber(null)  // El parámetro null puede reemplazarse por el código del país si lo necesitas
    @MinLength(10)
    @MaxLength(10)
    telefono: string;
}