import { UsersModule } from './users.module';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User, } from './schemas/user-schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import axios from 'axios';
import { error } from 'console';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private UsersModule: Model<User>) { }

    // Función para obtener el hash SHA-1 de una contraseña
    private sha1(password: string): string {
        return crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    }

    // Función para verificar si una contraseña ha sido comprometida usando la API de HIBP
    private async checkPasswordPwned(password: string): Promise<boolean> {
        const sha1Hash = this.sha1(password);
        const hashPrefix = sha1Hash.substring(0, 5); // Los primeros 5 caracteres del hash SHA-1

        try {
            console.log(`Consultando HIBP API con el prefijo: ${hashPrefix}`);
            const response = await axios.get(`https://api.pwnedpasswords.com/range/${hashPrefix}`);

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



    async createUser(user: CreateUserDto) {
        try {
            console.log('Iniciando creación de usuario para:', user.email);

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

}
