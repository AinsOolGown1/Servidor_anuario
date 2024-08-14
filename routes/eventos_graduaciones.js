const express = require('express');
const EventosProximos = require('../controller/eventograduacionController');
const subirImagenEvento = require("../Middleware/eventos_graduaciones");
const router = express.Router();

router.post('/cargar_evento', subirImagenEvento.single('img_evento'), EventosProximos.agregarEvento);

router.get('/ver_info_evento', EventosProximos.obtenerEventos);

router.get('/ver_imagen/:_id', EventosProximos.verImagenEventos);


module.exports = router;