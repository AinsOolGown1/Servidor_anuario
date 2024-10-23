const express = require('express');
const router = express.Router();
const CSVController = require("../controller/caragamasivaController")
const Cargamasiva = require("../Middleware/cargaGenerica");
const ImagenesMasiva = require('../Middleware/cargamasivaGraduado');
const multer = require('multer');

router.post('/subir_csv', Cargamasiva.single('file'), CSVController.CargaMasivaCSV );

// Ruta para la carga masiva de imágenes asociadas con los graduados
router.post('/imagenes_masivas', ImagenesMasiva.array('foto_graduado'), CSVController.CargaMasivaImagenes);

module.exports = router;