import { UsersModule } from './users.module';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument, } from './schemas/user-schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Incident } from './schemas/incident-schema';
import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import { createHash } from 'crypto';
import axios from 'axios';
import { error } from 'console';
import * as nodemailer from 'nodemailer';
import { PasswordUpdate } from './dto/update-user.dto';
import * as jwt from 'jsonwebtoken'; // Importa jsonwebtoken
import { Response, Request } from 'express';
import { Configure, ConfigureDocument } from 'src/configure/schema/configure-schema';
import { ImagesModule } from 'src/images/images.module';

@Injectable()
export class UsersService {
    // Estructura para almacenar los intentos de inicio de sesión por usuario
    private loginAttempts: { [email: string]: number } = {};
    private verificationCodes: { [email: string]: { code: string, expiration: Date } } = {};
    private emailStore: { [key: string]: { email: string; expiration: Date } } = {}; // Almacenar el email y su expiración

    constructor(@InjectModel(User.name) private UsersModule: Model<User>,
        @InjectModel(Incident.name) private IncidentModule: Model<Incident>,
        @InjectModel(Configure.name) private configureModel: Model<ConfigureDocument>,

    ) { }

    // Función para obtener el hash SHA-1 de una contraseña
    private sha1(password: string): string {
        return crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    }

    // Función para generar un código de verificación aleatorio
    private generateVerificationCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
    }



    // Función para verificar si una contraseña ha sido comprometida usando la API de HIBP
    private async checkPasswordPwned(password: string): Promise<boolean> {
        const sha1Hash = this.sha1(password);
        const hashPrefix = sha1Hash.substring(0, 5); // Los primeros 5 caracteres del hash SHA-1

        try {
            console.log(`Consultando HIBP API con el prefijo: ${hashPrefix}`);
            const response = await axios.get(`https://api.pwnedpasswords.com/range/${hashPrefix}`, { timeout: 5000 }); // Tiempo de espera de 5 segundos

            const hashes = response.data.split('\n');
            for (let hash of hashes) {
                const [suffix, count] = hash.split(':');
                if (hashPrefix + suffix === sha1Hash) {
                    console.warn(`¡Contraseña comprometida! Ha aparecido ${count} veces.`);
                    return true; // La contraseña está comprometida
                }
            }

            console.log('¡Contraseña segura!');
            return false; // La contraseña es segura
        } catch (error) {
            console.error('Error al verificar la contraseña con HIBP:', error);
            throw new InternalServerErrorException('No se pudo verificar la contraseña.');
        }
    }

    // Función para enviar un correo con el código de verificación
    private async sendVerificationEmail(email: string, code: string, html: string): Promise<void> {
        // Recuperar la configuración de intentos permitidos desde la base de datos
        const config = await this.configureModel.findOne(); // Suponiendo que solo hay un documento de configuración
        const emailTitle = config?.verificationEmailTitle;
        const emailGreeting = config?.verificationEmailGreeting;
        const emailFarewell = config?.verificationEmailFarewell;



        const transporter = nodemailer.createTransport({
            service: 'gmail', // Cambia el servicio según tu proveedor de correo
            auth: {
                user: "tallermecanicoheber@gmail.com", // Tu correo
                pass: "jnob kscj qcgf exer", // Contraseña o token de aplicación
            },
        });

        const mailOptions = {
            from: 'tallermecanicoheber@gmail.com',
            to: email,
            subject: 'Código de recuperación de contraseña',
            html: `<!DOCTYPE html>
              <html lang="es">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Código de Recuperación de Contraseña</title>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          background-color: #f7f7f7;
                          margin: 0;
                          padding: 20px;
                      }
                      .container {
                          max-width: 600px;
                          margin: 0 auto;
                          padding: 20px;
                          border: 1px solid #0056b3;
                          border-radius: 8px;
                          background-color: #ffffff;
                      }
                      h2 {
                          color: #0056b3;
                      }
                      p {
                          color: #333;
                      }
                      .code {
                          color: #e0a800; /* Color amarillo más oscuro */
                          font-weight: bold;
                      }
                      .image-container {
                          text-align: center;
                          margin-bottom: 20px;
                      }
                      /* Ajusta el tamaño de la imagen aquí */
                      img {
                          width: 150px;  /* Ajusta el tamaño deseado */
                          height: auto;  /* Mantiene la proporción de la imagen */
                          max-width: 100%; /* Asegura que la imagen no se salga del contenedor */
                      }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <div class="image-container">
                          <img src="https://taller-backend-two.vercel.app/images/latest" alt="Logo" />
                      </div>
                      <h2>${emailTitle}</h2>
                      <p>${emailGreeting}</p>
                      <p>Tu código de recuperación es: <span class="code">${code}</span>.</p>
                      <p>Este código expirará en 10 minutos.</p>
                      <p>${emailFarewell}</p>
                  </div>
              </body>
              </html>`,
        };


        try {
            await transporter.sendMail(mailOptions);
            console.log('Correo de recuperación enviado a:', email);
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            throw new InternalServerErrorException('Error al enviar el correo de recuperación');
        }
    }

    // 1. Solicitar recuperación de contraseña
    async requestPasswordReset(email: string): Promise<{ message: string }> {
        const user = await this.UsersModule.findOne({ email });
        if (!user) {
            throw new NotFoundException('El correo no está registrado.');
        }

        const resetCode = this.generateVerificationCode();
        this.verificationCodes[email] = {
            code: resetCode,
            expiration: new Date(Date.now() + 10 * 60000), // Expira en 10 minutos
        };

        // Almacenar el email y su tiempo de expiración
        this.emailStore[email] = {
            email,
            expiration: new Date(Date.now() + 10 * 60000), // Expira en 10 minutos
        };

        await this.sendVerificationEmail(email, resetCode, `
            <p>Tu código de recuperación de contraseña es: <strong>${resetCode}</strong>.</p>
            <p>Este código expirará en 10 minutos.</p>
        `);
        console.log("Correo de recuperación enviado")
        return { message: 'Código de recuperación enviado. Por favor, revisa tu correo.' };
    }


    // 2. Validar el código de verificación para recuperar la contraseña
    async validateResetCode(code: string): Promise<{ message: string }> {
        const emailEntry = Object.entries(this.emailStore).find(([_, entry]) => entry.expiration > new Date());
        if (!emailEntry) {
            throw new UnauthorizedException('El tiempo para validar el código ha expirado.');
        }

        const email = emailEntry[0]; // Extraer el email
        const reset = this.verificationCodes[email]; // Usar el email guardado

        if (!reset || reset.expiration < new Date()) {
            throw new UnauthorizedException('Código de recuperación expirado o no válido.');
        }

        if (reset.code !== code) {
            throw new UnauthorizedException('Código de recuperación incorrecto.');
        }
        console.log("Codigo de verificacion correcto")
        return { message: 'Código de recuperación verificado correctamente.' };
    }

    // 3. Actualizar la contraseña después de la verificación
    async updatePassword(password: string) {
        const emailEntry = Object.entries(this.emailStore).find(([_, entry]) => entry.expiration > new Date());
        if (!emailEntry) {
            throw new UnauthorizedException('El tiempo para actualizar la contraseña ha expirado.');
        }

        const email = emailEntry[0]; // Extraer el email

        if (!password) {
            throw new Error('La nueva contraseña no puede estar vacía.');
        }

        const user = await this.UsersModule.findOne({ email }); // Usar el email guardado
        if (!user) {
            throw new NotFoundException('El usuario no está registrado. Por favor, regístrate.');
        }

        const isPwned = await this.checkPasswordPwned(password);
        if (isPwned) {
            throw new ConflictException('La contraseña ha sido comprometida, por favor elige una contraseña diferente.');
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await this.UsersModule.updateOne(
            { email },
            { $set: { password: hashPassword } }
        );

        // Limpiar el email temporal después de la actualización
        delete this.emailStore[email]; // Eliminar el email del almacenamiento
        console.log("Cambio correcto de contraseña")
        return { message: 'Contraseña actualizada con éxito' };
    }




    async verifyCode(email: string, code: string): Promise<{ message: string }> {
        const verification = this.verificationCodes[email];

        // Verificar si existe un código para ese correo y si no ha expirado
        if (!verification || verification.expiration < new Date()) {
            throw new UnauthorizedException('Código de verificación expirado o no válido.');
        }

        // Verificar si el código coincide
        if (verification.code !== code) {
            throw new UnauthorizedException('Código de verificación incorrecto.');
        }

        // Si el código es correcto, permitir el inicio de sesión
        delete this.verificationCodes[email]; // Borrar el código ya utilizado
        console.log(`Código de verificación correcto para ${email}.`);

        return { message: 'Inicio de sesión exitoso. Código verificado.' };
    }


    async createUser(user: CreateUserDto) {
        try {
            console.log('Iniciando creación de usuario para:', user.email);

            // Verificar si el teléfono es una cadena de 10 caracteres
            if (typeof user.phone !== 'string' || user.phone.length !== 10) {
                console.warn('El teléfono debe tener exactamente 10 caracteres y ser una cadena:', user.phone);
                throw new BadRequestException('El número de teléfono debe tener exactamente 10 caracteres.');
            }

            const userFound = await this.UsersModule.findOne({ email: user.email });
            if (userFound) {
                console.warn('El correo ya está en uso:', user.email);
                throw new ConflictException('El correo ya está en uso');
            }

            // Verificar si la contraseña ha sido comprometida
            console.log('Verificando si la contraseña ha sido comprometida.');
            const isPwned = await this.checkPasswordPwned(user.password);
            if (isPwned) {
                console.warn('La contraseña ha sido comprometida para el usuario:', user.email);
                throw new ConflictException('La contraseña ha sido comprometida, por favor elige una contraseña diferente.');
            }

            // Hashear la contraseña si es segura
            console.log('Hasheando la contraseña.');
            const hashPassword = await bcrypt.hash(user.password, 10);

            const res = new this.UsersModule({
                ...user,
                password: hashPassword,
                estado: true,
                bloked: false,
                role: 'client',
            });

            console.log('Guardando el usuario en la base de datos.');
            await res.save();

            console.log('Usuario creado exitosamente:', res);
            return res;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw new InternalServerErrorException('Error al crear el usuario');
        }
    }

    async loginUser(login: LoginUserDto, @Res() res: Response) {
        // Recuperar la configuración de intentos permitidos desde la base de datos
        const config = await this.configureModel.findOne(); // Suponiendo que solo hay un documento de configuración
        const maxAttempts = config?.intent || 5; // Si no existe el valor en la BD, utiliza 3 como valor predeterminado
        const tokeLifetime = config?.tokenLifetime;



        try {
            const { email, password } = login;
            console.log(`Intantando iniciar sesion para: ${email}`);

            // Inicializa el contador de intentos fallidos si no existe para este usuario
            if (!this.loginAttempts[email]) {
                this.loginAttempts[email] = 0;
            }

            // Buscar el usuario por correo electrónico
            const user = await this.UsersModule.findOne({ email });
            if (!user) {
                console.log(`El usuario necesita registrarse: ${email}`);
                throw new NotFoundException('El usuario no está registrado. Por favor, regístrate.');
            }

            // Verificar si el usuario está bloqueado
            if (user.bloked) throw new UnauthorizedException('El usuario está bloqueado por el administrador.');

            // Verificar si el usuario está activo
            if (!user.estado) {
                console.log(`El usuario está inactivo: ${email}`);
                const incident = new this.IncidentModule({
                    email,
                    timestamp: new Date(),
                    description: `Bloqueado`
                });
                await incident.save();
                throw new UnauthorizedException('El usuario está inactivo. Excedio el número de intentos.');
            }

            // Verificar la contraseña
            const isPasswordMatching = await bcrypt.compare(password, user.password);
            if (!isPasswordMatching) {
                if (this.loginAttempts[email] < maxAttempts) {
                    this.loginAttempts[email] += 1;
                    console.log(`Contraseña incorrecta para el usuario: ${email}, intentos:${this.loginAttempts[email]}`);
                    // Registrar el intento fallido en la colección de incidencias
                    const incident = new this.IncidentModule({
                        email,
                        timestamp: new Date(),
                        description: `Intento de inicio de sesión fallido. Intento número: ${this.loginAttempts[email]}`
                    });
                    await incident.save();
                    throw new UnauthorizedException(`Contraseña incorrecta,intentos:${this.loginAttempts[email]}`);
                }

                // Actualizar el estado del usuario a 'false' en la base de datos
                await this.UsersModule.updateOne(
                    { email: email },    // Filtro de búsqueda por email
                    { $set: { estado: false } }  // Actualizar el estado a false
                );
                console.log(`Usuario bloqueado: ${email}. Se restablecerá el estado en 5 minutos.`);

                // Restablecer el estado del usuario a 'true' después de 5 minutos
                setTimeout(async () => {
                    await this.UsersModule.updateOne(
                        { email: email },
                        { $set: { estado: true } } // Actualizar el estado a true
                    );
                    this.loginAttempts[email] = 0;
                    console.log(`Estado del usuario ${email} restablecido a 'true'.`);
                }, 300000); // 300000 ms = 5 minutos

                throw new UnauthorizedException('Usuario bloqueado debido a demasiados intentos fallidos.');

            }
            this.loginAttempts[email] = 0

            const resetCode = this.generateVerificationCode();
            this.verificationCodes[email] = {
                code: resetCode,
                expiration: new Date(Date.now() + 10 * 60000), // Expira en 10 minutos
            };

            // Almacenar el email y su tiempo de expiración
            this.emailStore[email] = {
                email,
                expiration: new Date(Date.now() + 10 * 60000), // Expira en 10 minutos
            };

            // Si la contraseña es correcta, generar el token JWT
            const token = this.generateToken(user);

            // Establecer la cookie con el token
            res.cookie('token', token, {
                httpOnly: true,  // Para evitar que el frontend pueda acceder a la cookie
                secure: true,    // Asegúrate de usarlo en producción con HTTPS
                maxAge: tokeLifetime  // Expira en 1 hora (en milisegundos)
            });


            // Guardar el token en una cookie (con opciones de seguridad)
            res.cookie('jwt', token, {
                httpOnly: true,   // Asegura que la cookie no sea accesible desde JavaScript
                secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
                sameSite: 'strict',  // Previene ataques CSRF
                maxAge: 24 * 60 * 60 * 1000,  // Expiración en 1 día
            });
            // Retornar el token y los datos del usuario en la respuesta
            return res.json({
                message: 'Inicio de sesión exitoso',
                user: {
                    email: user.email,
                    role: user.role,
                    // Otros campos que desees devolver
                },
                token  // También puedes devolver el token si lo necesitas en el frontend
            });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    }

    // Método para generar un token JWT
    private generateToken(user: any) {
        const payload = { role: user.role, id: user._id };
        const secret = 'dff3c7ef5be6b1dfa77350c0eeb786c529ecc1312f4660b794cbcc1562ef924a'; // Asegúrate de que esto no sea undefined
        if (!secret) {
            throw new Error('JWT_SECRET no está definido');
        }
        return jwt.sign(payload, secret, { expiresIn: '1h' });
    }

}
