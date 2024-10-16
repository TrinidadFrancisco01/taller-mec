import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    email:string;   

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(8)
    password:string;
}