export class ImagesDto {
    filename: string;
    data: Buffer; // Buffer para almacenar la imagen en formato binario
    contentType: string; // Tipo de contenido de la imagen (por ejemplo, 'image/jpeg', 'image/png', etc.)
}
