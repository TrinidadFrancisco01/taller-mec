import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class CreateUserDto{

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    name:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    surname:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(30)
    email:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    phone:string;

    @IsString()
    @IsNotEmpty()
    role:string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(8)
    password:string;

    @IsBoolean()
    @IsNotEmpty()
    estado: boolean;

    @IsBoolean()
    @IsNotEmpty()
    bloked: boolean;



}