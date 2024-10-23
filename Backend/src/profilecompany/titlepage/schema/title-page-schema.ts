import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TitlepageDocument = TitlePage & Document;

@Schema({
    timestamps:true,
})
export class TitlePage{
    @Prop({
        required: true
    })
    title : string;
}

export const   TitlePageSchema =  SchemaFactory.createForClass(TitlePage)