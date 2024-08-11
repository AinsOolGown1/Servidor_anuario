const mongoose = require('mongoose');

const EventosGraduacionesSchema = mongoose.Schema({
    campus_evento: {
        type: String,
        required: true
    },
    year_evento: {
        type: String,
        required: true
    },
    img_evento: {
        type: String,
        required: true
    },
    sesion: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Eventos', EventosGraduacionesSchema);

