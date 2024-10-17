import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { PasswordUpdate } from './dto/update-user.dto';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }
    @Post()
    createUser(@Body() user: CreateUserDto) {
        return this.userService.createUser(user)
    }

    @Post('login')
    async login(@Body() login: LoginUserDto) {
        return this.userService.loginUser(login);
    }

    @Post("verify-code")
    async verifyCode(@Body() body: { email: string, code: string }) {
        const { email, code } = body;
        return this.userService.verifyCode(email, code)
    }
    
    @Post("restablecer-password")
    async restablecerContraseña(){
        return 
    }

    /*@Patch("change-password/:id")
    async changePassword(@Param("id") id: string, @Body() updatePass: PasswordUpdate) {
        return this.userService.+(id, updatePass);
    }*/
}
