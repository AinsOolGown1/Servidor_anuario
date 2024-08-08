const mongoose = require('mongoose');

const Coleccion_graduacionSchema = mongoose.Schema({
    campus: {
        type: String,
        required: true
    },
    year_graduacion: {
        type: String,
        required: true
    },
    fotos_graduaciones: {
        type: [String],
        required: true
    },
    sesion: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('ColeccionGraduacion', Coleccion_graduacionSchema);

