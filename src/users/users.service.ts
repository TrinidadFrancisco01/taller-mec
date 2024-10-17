import { UsersModule } from './users.module';
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class UsersService {
    // Estructura para almacenar los intentos de inicio de sesión por usuario
    private loginAttempts: { [email: string]: number } = {};
    private verificationCodes: { [email: string]: { code: string, expiration: Date } } = {};
    private emailStore: { [key: string]: { email: string; expiration: Date } } = {}; // Almacenar el email y su expiración

    constructor(@InjectModel(User.name) private UsersModule: Model<User>, @InjectModel(Incident.name) private IncidentModule: Model<Incident>) { }

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
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Cambia el servicio según tu proveedor de correo
            auth: {
                user: "tallermecanicoheber@gmail.com", // Tu correo
                pass: "jnob kscj qcgf exer", // Contraseña o token de aplicación
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código de recuperación de contraseña',
            text: `Tu código de recuperación es: ${code}. Este código expirará en 10 minutos.`,
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

    async loginUser(login: LoginUserDto) {
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
            // Verificar si el usuario está activo
            if (!user.estado) {
                console.log(`El usuario está inactivo: ${email}`);
                throw new UnauthorizedException('El usuario está inactivo. Contacta al administrador.');
            }

            // Verificar la contraseña
            const isPasswordMatching = await bcrypt.compare(password, user.password);
            if (!isPasswordMatching) {
                if (this.loginAttempts[email] < 5) {
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
                console.log(`Usuario bloqueado: ${email}. Se restablecerá el estado en 5 segundos.`);

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


            this.loginAttempts[email] = 0;

            // Si la contraseña es correcta, generar el código de verificación
            const verificationCode = this.generateVerificationCode();
            // Almacenar el código de verificación con una expiración de 10 minutos
            this.verificationCodes[email] = {
                code: verificationCode,
                expiration: new Date(Date.now() + 10 * 60000), // Expira en 10 minutos
            };

            // Enviar el código al correo del usuario
            await this.sendVerificationEmail(email, verificationCode, `
            <p>Tu código de verificación es: <strong>${verificationCode}</strong>.</p>
            <p>Este código expirará en 10 minutos.</p>
        `);

            console.log(`Código de verificación enviado a ${email}`);
            return { message: 'Código de verificación enviado. Por favor, revisa tu correo electrónico.' };

            // Aquí puedes generar y devolver un token JWT si lo deseas
            // const token = this.generateJwtToken(user);
            // return { user, token };

            // Para simplificar, devolvemos el usuario
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw error;
        }
    }
    // Opcional: Método para generar un token JWT
    // private generateJwtToken(user: User): string {
    //     const payload = { sub: user._id, email: user.email };
    //     return this.jwtService.sign(payload);
    // }

}
