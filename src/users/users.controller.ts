import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService){}
    @Post()
    createUser(@Body() user:CreateUserDto){
        return this.userService.createUser(user)
    }

    @Post('login')
    async login(@Body() login: LoginUserDto) {
        return this.userService.loginUser(login);
    }
}
