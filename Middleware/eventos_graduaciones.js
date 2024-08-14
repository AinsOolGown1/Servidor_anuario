const multer = require("multer");

const guardarImagenEvento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads-eventos');
    },
    filename: (req, file, cb) => {
        const campus_evento = req.body.campus_evento; // Obtener el nombre del campus desde el cuerpo de la solicitud
        if (campus_evento) {
            const ext = file.originalname.split('.').pop();
            const nombreArchivo = `${campus_evento}.${ext}`; // Usar el nombre del campus como nombre del archivo
            cb(null, nombreArchivo);
        } else {
            cb(new Error('Nombre del Campus no proporcionado en la solicitud'), null);
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

const subirImagenEvento = multer({ storage: guardarImagenEvento, fileFilter: filtroImagen });

module.exports = subirImagenEvento;
