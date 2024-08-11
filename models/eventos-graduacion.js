const mongoose = require('mongoose');

const Evento_graduacionSchema = mongoose.Schema({
    nombre_evento: {
        type: String,
        required: true
    },
    campus: {
        type: String,
        required: true
    },
    year_graduacion: {
        type: String,
        required: true
    },
    foto_evento: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('EventosProximos', Evento_graduacionSchema);

