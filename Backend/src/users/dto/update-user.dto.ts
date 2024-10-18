import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class PasswordUpdate {
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(10)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    email: string;
}
