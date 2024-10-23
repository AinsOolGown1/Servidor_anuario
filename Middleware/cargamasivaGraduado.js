const multer = require("multer");
const path = require('path');

// Configuración de almacenamiento
const guardarImagen = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads-graduados'); // Directorio donde se almacenarán las imágenes
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);  // Obtener la extensión del archivo
        const carnet = path.basename(file.originalname, fileExtension);  // Usar el nombre del archivo como el número de carnet
        
        // Validar que el nombre del archivo sea numérico (es decir, que sea un carnet válido)
        if (carnet && !isNaN(carnet)) {
            const nombreArchivo = `${carnet}${fileExtension}`; // Usar el número de carnet como nombre del archivo
            cb(null, nombreArchivo);
        } else {
            cb(new Error('El nombre del archivo no es un número de carné válido'), null);
        }
    }
});

// Filtro para aceptar solo imágenes con formatos específicos
const filtroImagen = (req, file, cb) => {
    if (file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
        cb(null, true);  // Aceptar archivo
    } else {
        cb(new Error('Archivo no permitido. Solo se aceptan archivos JPG, JPEG o PNG'), false);  // Rechazar archivo
    }
};

// Configuración de multer para subir imágenes múltiples
const ImagenesMasiva = multer({ storage: guardarImagen, fileFilter: filtroImagen });

module.exports = ImagenesMasiva;
