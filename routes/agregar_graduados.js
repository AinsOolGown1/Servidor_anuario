const express = require('express');
const router = express.Router();
const GraduadosController = require('../controller/graduadoController');
const subirImagen = require("../Middleware/Storage");

//Agregar graduado 
router.post('/agregar', subirImagen.single('foto_graduado'), GraduadosController.agregarGraduado);

//Mostrar todos los graduados
router.get('/obtener', GraduadosController.obtenerGraduados);

//Ver Imagen
router.get('/buscar/imagen/:carnet', GraduadosController.verImagengraduado)

//Editar/Actualizar graduado
router.put('/actualizar/:id', subirImagen.single('foto_graduado'), GraduadosController.updateGraduado);

//Mostrar un graduado en especifico
router.get('/obtener/:id', GraduadosController.obtenerUngraduado);

//Eliminar graduado
router.delete('/eliminar/:id', GraduadosController.eliminarGraduado);

// Ruta para mostrar un graduado por carnet
router.get('/buscar-carnet/:carnet', GraduadosController.mostrarPorCarnet);

// Ruta para filtrar graduados
router.get('/filtrar', GraduadosController.filtrarGraduados);

module.exports = router;