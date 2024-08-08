const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Archivo JSON que almacena los contadores
const countersFilePath = path.join(__dirname, 'counters.json');

// Función para leer el contador desde el archivo JSON
const readCounter = (campus, year) => {
    if (!fs.existsSync(countersFilePath)) {
        return 1;
    }
    const counters = JSON.parse(fs.readFileSync(countersFilePath, 'utf8'));
    const key = `${campus}_${year}`;
    return counters[key] ? counters[key] + 1 : 1;
};

// Función para actualizar el contador en el archivo JSON
const updateCounter = (campus, year, counter) => {
    const counters = fs.existsSync(countersFilePath) ? JSON.parse(fs.readFileSync(countersFilePath, 'utf8')) : {};
    const key = `${campus}_${year}`;
    counters[key] = counter;
    fs.writeFileSync(countersFilePath, JSON.stringify(counters), 'utf8');
};

// Configuración de multer
const guardarColeccionFotos = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads_coleccion_fotos');
    },
    filename: (req, file, cb) => {
        const { campus, year_graduacion } = req.body; //* Obtener campus y year_graduacion desde el cuerpo de la solicitud
        if (campus && year_graduacion) {
            const counter = readCounter(campus, year_graduacion);
            updateCounter(campus, year_graduacion, counter);
            const ext = file.originalname.split('.').pop();
            const nombreArchivo = `${campus}_${year_graduacion}_${counter}.${ext}`; // Usar campus, year_graduacion y counter como nombre del archivo
            cb(null, nombreArchivo);
        } else {
            cb(new Error('Campus o año de graduación no proporcionado en la solicitud'), null);
        }
    }
});

const filtroImagen = (req, file, cb) => {
    if(file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
        cb(null, true);
    } else {
        cb(new Error('Archivo no permitido'), false);
    }
};

const subirColeccionFotos = multer({ storage: guardarColeccionFotos, fileFilter: filtroImagen });

module.exports = subirColeccionFotos;
