const mongoose = require('mongoose');

const Estudiante_graduadoSchema = mongoose.Schema({
    carnet:{
        type: String,
        required: true
    },
    nombres:{
        type: String,
        required: true
    },
    apellidos:{
        type: String,
        required: true
    },
    facultad:{
        type: String,
        required: true
    },
    carrera:{
        type: String,
        required: true
    },
    campus:{
        type: String,
        required: true
    },
    frase_emotiva:{
        type: String,
        required: true
    },
    year_graduado:{
        type: String,
        required: true
    },
    telefono_graduado:{
        type: String,
        required: true
    },
    correo_graduado:{
        type: String,
        required: true
    },
    estado_graduado:{
        type: Boolean,
        required: true
    },
    destacado_graduado:{
        type: Boolean,
        required: true
    },
    foto_graduado:{
        type: String,
        required: false
    },
    qr_graduado:{
        type: String,
        required: true
    },
    fecha_creacion: {
        type:Date,
        default: Date.now()  //Fecha de creación del documento
    }
});

module.exports = mongoose.model('Graduados', Estudiante_graduadoSchema);