import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MisionDocument = Mision & Document;

@Schema({
    timestamps: true,
})

export class Mision {
    @Prop({ required: true })
    title: string;
  
    @Prop({ required: true })
    description: string;
}

export const MisionSchema = SchemaFactory.createForClass(Mision)