const multer = require("multer");

const guardarImagen = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads-graduados');
    },
    filename: (req, file, cb) => {
        const carnet = req.body.carnet; // Obtener el número de carnet desde el cuerpo de la solicitud
        if (carnet) {
            const ext = file.originalname.split('.').pop();
            const nombreArchivo = `${carnet}.${ext}`; // Usar el número de carnet como nombre del archivo
            cb(null, nombreArchivo);
        } else {
            cb(new Error('Número de carnet no proporcionado en la solicitud'), null);
        }
    }
});

const filtroImagen = (req, file, cb) => {
    if(file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' )) {
        cb(null, true);
    } else {
        cb(new Error('Archivo no permitido'), false);
    }
};

const subirImagen = multer({ storage: guardarImagen, fileFilter: filtroImagen });

module.exports = subirImagen;
