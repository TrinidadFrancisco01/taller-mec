import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Incident extends Document {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    timestamp: Date;

    @Prop({ required: true })
    description: string;
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);