import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export type VisionDocument = Vision & Document;

@Schema({
    timestamps: true,
})

export class Vision{
    @Prop({required: true})
    title: string;

    @Prop({required:true})
    description: string;
}

export const VisionSchema = SchemaFactory.createForClass(Vision)