const fs = require('fs');
const multer = require('multer');
const ColeccionGraduacion = require("../models/ColeccionGraduacion");
const path = require('path');
const mongoose = require('mongoose');

exports.agregarColeccionFotos = async (req, res) => {
    try {
        // Array para almacenar las rutas de los archivos subidos
        let rutasFotos = [];

        // Si hay archivos, agregar sus rutas al array
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                rutasFotos.push(file.path);
            });
        }

        // Añadir las rutas de las fotos al cuerpo de la solicitud
        req.body.fotos_graduaciones = rutasFotos;

        // Verificar que year_graduacion y sesion estén presentes
        const { year_graduacion, sesion } = req.body;

        if (!year_graduacion || !sesion) {
            return res.status(400).json({ msg: 'Los campos año de graduacion y sesion son requeridos' });
        }

        // Crear una nueva instancia del modelo con los datos recibidos
        const graduacion = new ColeccionGraduacion(req.body);

        // Guardar la instancia en la base de datos
        await graduacion.save();

        // Enviar la respuesta con los datos guardados
        res.status(200).send(graduacion);
    } catch (error) {
        console.error("Error al agregar colección de fotos:", error);
        res.status(500).json({ msg: 'Hubo un error al agregar graduado' });
    }
};

exports.verImagenesgraduaciones = async (req, res) => {

        const {campus, year, sesion} = req.params;
    try{
        const fotosGraduaciones = await ColeccionGraduacion.find({campus, year_graduacion: year, sesion });

        let ruta_imagen = path.join(__dirname,`../${fotosGraduaciones.fotos_graduaciones}`)

        //*Codigo para recorrer el array de imagenes
        let array_imagenes = fotosGraduaciones.map(item=>{
            return item.fotos_graduaciones
        });
        console.log('Muestra el contenido del Array',fotosGraduaciones);
        
        let coleccion_flat = array_imagenes.flat(1)

        let coleccion_ruta_completa = []

        coleccion_flat.forEach(item =>{
            let ruta_imagen = path.join(__dirname,`../${item}`)
            coleccion_ruta_completa.push(ruta_imagen)
        })

        let coleccion_base64 = [];

        coleccion_ruta_completa.forEach(ruta_item =>{
            
            let imagen = fs.readFileSync(ruta_item);
            let imagenBase64 = Buffer.from(imagen).toString('base64');
            let mimeType = path.extname(ruta_imagen).substring(1);

            coleccion_base64.push(`data:image/${mimeType};base64,${imagenBase64}`)
        })
        res.json({coleccion_base64})
    }catch(error){
        console.log('No se encontrarón las imagenes', error);
    }
};


exports.obtenerColeccionGraduaciones = async (req, res) => {
    try {
        const coleccion_graduaciones = await ColeccionGraduacion.find();
        const coleccion_graduaciones_datos = coleccion_graduaciones.map(GRADUACIONES => {
            return {
                _id: GRADUACIONES._id,
                campus: GRADUACIONES.campus,
                year_graduacion: GRADUACIONES.year_graduacion,
                sesion: GRADUACIONES.sesion,
                // URL de la imagen
                fotos_graduaciones: (() => {
                    const extensions = ['jpg', 'jpeg', 'png'];
                    for (const ext of extensions) {
                        const filePath = `public/uploads_coleccion_fotos/${GRADUACIONES.campus.year_graduacion}.${ext}`;
                        if (fs.existsSync(filePath)) {
                            return filePath;
                        }
                    }
                    return null; // Si no se encuentra ninguna foto con las extensiones especificadas
                })(),
            };
        });
        res.json(coleccion_graduaciones_datos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.verFotosGraduaciones = async (req, res) => {
    const _id = req.params._id || req.body._id;
    try {
        const coleccion_fotos_graduaciones = await ColeccionGraduacion.findById(_id);

        if (!coleccion_fotos_graduaciones) {
            return res.status(404).json({ msg: "Colección no encontrada" });
        }

        // Convertir las rutas de las fotos para usar barras normales
        coleccion_fotos_graduaciones.fotos_graduaciones = coleccion_fotos_graduaciones.fotos_graduaciones.map(ruta =>
            ruta.replace(/\\/g, '/') // Reemplaza las barras invertidas con barras normales
        );

        res.json(coleccion_fotos_graduaciones);
    } catch (error) {
        console.error('Error al obtener la colección de graduaciones:', error);
        res.status(500).json({ msg: "Error del servidor" });
    }
};

exports.ColeccionGraduaciones = async (req, res) => {
    try {
        const colecciones = await ColeccionGraduacion.find(); // Obtener todos los documentos
        res.json(colecciones);
    } catch (error) {
        console.error('Error al obtener las colecciones de graduaciones:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};