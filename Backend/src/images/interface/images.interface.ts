import { Document } from "mongoose";

export interface Images extends Document {
    filename: string;
    data: Buffer;           // Datos binarios de la imagen
    contentType: string;    // Tipo de contenido (por ejemplo, 'image/jpeg', 'image/png')
}