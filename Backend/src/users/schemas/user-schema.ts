import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
@Schema({
    timestamps: true,
})

export class User {
    @Prop({
        required: true,
        trim: true,
    })
    name: string;

    @Prop({
        required: true,
        trim: true,
    })
    surname: string;

    @Prop({
        required: true,
        trim: true,
        unique: true
    })
    email: string;

    @Prop({
        required: true,
        trim: true
    })
    phone: string;


    @Prop({
        required: true,
        trim: true
    })
    password: string;

    @Prop({
        required: true,
        trim: true
    })
    role:string;


    @Prop({
        required: true,
        type: Boolean, // Definimos que es un booleano
        default: true, // Puedes establecer un valor por defecto si lo deseas
    })
    estado: boolean;

    @Prop({
        required: true,
        type: Boolean, // Definimos que es un booleano
        default: false, // Puedes establecer un valor por defecto si lo deseas
    })
    bloked: boolean

    @Prop({
        type: Number,
        default: 0, // Inicializamos el contador en 0
    })
    loginAttempts: number;

}

export const UserSchema = SchemaFactory.createForClass(User)