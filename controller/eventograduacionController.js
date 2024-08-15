const fs = require('fs');
const multer = require('multer');
const EventoGraduaciones = require("../models/eventos_graduacion");
const path = require('path');
const mongoose = require('mongoose');

exports.agregarEvento = async (req, res) => {
    try {
        let evento;

        //* Si hay una imagen, añadir la ruta de la imagen al cuerpo de la solicitud
        if (req.file) {
            req.body.img_evento = req.file.path;
        }

        evento = new EventoGraduaciones(req.body)

        await evento.save();
        res.send(evento);
    } catch (error) {
        console.error("Error al agregar el Evento:", error);
        res.status(500).json({ msg: 'Hubo un error al agregar evento' });
    }
};

exports.obtenerEventos = async (req, res) => {
    try {
        const eventos = await EventoGraduaciones.find();
        const eventosConDatos = eventos.map(datos_evento => {
            return {
                _id: datos_evento._id,
                campus_evento: datos_evento.campus_evento,
                year_evento: datos_evento.year_evento,
                img_evento: (() => {
                    const extension = ['jpg', 'jpeg', 'png'];
                    for (const ext of extension){
                        //Busca el archivo en uploads-eventos
                        const filePath = `public/uploads-eventos/${datos_evento.campus_evento}.${ext}`;
                        if (fs.existsSync(filePath)){
                            return filePath;
                        }
                    }
                    return null; // Si no se encuentra ninguna foto con las extensiones especificadas
                })(),
                sesion: datos_evento.sesion
            };
        });
        res.json(eventosConDatos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.verImagenEventos = async (req, res) => {
    const { _id } = req.params;
    console.log("ID recibido:", _id);

    // Verifica si el _id es válido antes de continuar
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ msg: "ID no válido" });
    }

    try {
        const eventos_proximos = await EventoGraduaciones.findOne({ _id });

        if (!eventos_proximos) {
            return res.status(404).json({ msg: "No se encontró el evento" });
        }

        let ruta_imagen = path.join(__dirname, `../${eventos_proximos.img_evento}`);

        if (!fs.existsSync(ruta_imagen)) {
            return res.status(404).json({ msg: "No se encontró la imagen del evento" });
        }

        res.sendFile(ruta_imagen);

    } catch (error) {
        console.log("Error al buscar el evento:", error);
        res.status(500).json({ msg: "Hubo un error en el servidor" });
    }
};
