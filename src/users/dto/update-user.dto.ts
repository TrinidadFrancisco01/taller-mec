import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsNotEmpty, IsString, MaxLength, maxLength, MinLength } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto){

}

export class PasswordUpdate{

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(10)
    password:string;
}