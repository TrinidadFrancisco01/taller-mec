export const renameImage = (req, file, callback) => {
    const name = file.originalname.split('.')[0]; // Nombre del archivo sin la extensión
    const extension = file.originalname.split('.').pop(); // Extensión del archivo
    const randomNumber = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16)) // Genera un número aleatorio hexadecimal
        .join('');

    const newFilename = `${name}-${randomNumber}.${extension}`; // Nuevo nombre con número aleatorio y extensión

    console.log(newFilename); // Muestra el nuevo nombre del archivo

    callback(null, newFilename); // Devuelve el nuevo nombre del archivo
};


export const fileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Invalid format type'), false)
    }
    callback(null, true);
}