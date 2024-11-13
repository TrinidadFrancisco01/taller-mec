import { Body, Controller, Get, Param, Patch, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { PasswordUpdate } from './dto/update-user.dto';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken'; // Asegúrate de tener jsonwebtoken instalado.

@Controller('users')
export class UsersController {

  constructor(private userService: UsersService) { }
  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user)
  }

  @Get('token')
  getToken(@Req() req: Request, @Res() res: Response) {
    // Recuperar el token de las cookies
    const token = req.cookies['token'];
    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }

    try {
      // Desencriptar el token (asumiendo que se usó JWT)
      const decodedToken = jwt.verify(token, 'dff3c7ef5be6b1dfa77350c0eeb786c529ecc1312f4660b794cbcc1562ef924a');
      res.status(200).json({ token: decodedToken });
    } catch (error) {
      throw new UnauthorizedException('Token no válido');
    }
  }

  @Post('login')
  async login(@Body() login: LoginUserDto, @Res() res: Response) {
    return this.userService.loginUser(login, res);  // Pasamos `res` a `loginUser`
  }

  @Post("verify-code")
  async verifyCode(@Body() body: { email: string, code: string }) {
    const { email, code } = body;
    return this.userService.verifyCode(email, code)
  }


  // 1. Solicitar recuperación de contraseña
  @Post('request-password-reset')
  async requestPasswordReset(@Body() body: { email: string }) {
    const { email } = body;
    return this.userService.requestPasswordReset(email);
  }

  // 2. Validar el código de verificación
  @Post('verify-reset-code')
  async validateResetCode(@Body() body: { code: string }) {
    return this.userService.validateResetCode(body.code);
  }


  // 3. Actualizar la contraseña
  @Post('update-password')
  async updatePassword(@Body() pass: { password: string }) {
    return this.userService.updatePassword(pass.password);
  }
}
