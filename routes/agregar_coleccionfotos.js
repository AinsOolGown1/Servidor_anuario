const express = require('express');
const ColeccionFotosController = require('../controller/coleccionfotosController');
const subirColeccionFotos = require("../Middleware/Storage_Coleccionfotos");
const router = express.Router();


router.post('/cargar-coleccion', subirColeccionFotos.array('fotos_graduaciones', 10), ColeccionFotosController.agregarColeccionFotos);

router.get('/buscar/imagen/:campus/:year/:sesion', ColeccionFotosController.verImagenesgraduaciones);

router.get('/mostrar_coleccion_graduaciones', ColeccionFotosController.obtenerColeccionGraduaciones);

router.get('/mostrar_coleccion_graduaciones/:_id', ColeccionFotosController.verFotosGraduaciones)

router.get('/coleccion_graduaciones', ColeccionFotosController.ColeccionGraduaciones);

router.get('/ver_coleccion/fotos/:_id', ColeccionFotosController.obtenerFotosGraduacion);

router.post('/filtrar-coleccion', ColeccionFotosController.filtrarColeccion);

module.exports = router;