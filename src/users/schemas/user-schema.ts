import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})

export class User {
    @Prop({
        required: true,
        trim:true,
    })
    name:string;

    @Prop({
        required: true,
        trim: true,
    })
    surname:string;

    @Prop({
        required:true,
        trim:true,
        unique:true
    })
    email:string;

    @Prop({
        required:true,
        trim:true
    })
    phone:string;


    @Prop({
        required:true,
        trim:true
    })
    password:string;
}

export const UserSchema = SchemaFactory.createForClass(User)