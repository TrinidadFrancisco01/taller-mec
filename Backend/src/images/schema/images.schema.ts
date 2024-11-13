import { Schema } from 'mongoose';

export const ImagesSchemas = new Schema(
    {
        filename: { type: String, required: false },
        data: { type: Buffer, required: false },
        contentType: { type: String, required: true },
    },
    { timestamps: true }  // Esto agrega automáticamente createdAt y updatedAt
);
