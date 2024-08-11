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