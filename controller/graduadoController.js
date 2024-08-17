const fs = require( 'fs' );
const multer = require('multer');
const subirImagen = require("../Middleware/Storage");
const Graduado = require("../models/GraduadoEstudent");
const path =require( 'path' );
const XLSX = require('xlsx');
const mongoose = require( 'mongoose')

exports.agregarGraduado = async (req, res) => {
    try {
        let graduado;

        //* Si hay una imagen, añadir la ruta de la imagen al cuerpo de la solicitud
        if (req.file) {
            req.body.foto_graduado = req.file.path;
        }

        graduado = new Graduado(req.body)

        await graduado.save();
        res.send(graduado);
    } catch (error) {
        console.error("Error al agregar graduado:", error);
        res.status(500).json({ msg: 'Hubo un error al agregar graduado' });
    }
};

exports.verImagengraduado = async (req, res) => {
    const {carnet} = req.params;
    try{
        const estudiante = await Graduado.findOne({ carnet });

        let ruta_imagen = path.join(__dirname,`../${estudiante.foto_graduado}`)
        if (!fs.existsSync(ruta_imagen)){
            return res.status(404).json({msg:"No se encontro la foto del graduado"}) 
        }
        res.sendFile(ruta_imagen);
        
    }catch(error){
        console.log(error);
    }
}

exports.filtrarGraduados = async (req, res) => {
    try {
        const { campus, facultad, carrera, year } = req.query;

        // Construir el filtro para la consulta
        const filter = {};

        if (campus) filter.campus = campus;
        if (facultad) filter.facultad = facultad;
        if (carrera) filter.carrera = carrera;
        if (year) filter.year_graduado = year;

        // Ejecutar la consulta con el filtro
        const graduadosFiltrados = await Graduado.find(filter);

        // Retornar los graduados filtrados como respuesta
        res.json(graduadosFiltrados);
    } catch (error) {
        console.error("Error al filtrar graduados:", error);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

exports.obtenerGraduados = async (req, res) => {
    try {
        const graduados = await Graduado.find();
        const graduadosConDatos = graduados.map(graduado => {
            return {
                _id: graduado._id,
                carnet: graduado.carnet,
                nombres: graduado.nombres,
                apellidos: graduado.apellidos,
                carrera: graduado.carrera,
                facultad: graduado.facultad,
                campus: graduado.campus,
                frase_emotiva: graduado.frase_emotiva,
                year_graduado: graduado.year_graduado,
                telefono_graduado: graduado.telefono_graduado,
                correo_graduado: graduado.correo_graduado,
                estado_graduado: graduado.estado_graduado,
                destacado_graduado: graduado.destacado_graduado,
                // URL de la imagen
                foto_graduado: (() => {
                    const extensions = ['jpg', 'jpeg', 'png'];
                    for (const ext of extensions) {
                        const filePath = `public/uploads-graduados/${graduado.carnet}.${ext}`;
                        if (fs.existsSync(filePath)) {
                            return filePath;
                        }
                    }
                    return null; // Si no se encuentra ninguna foto con las extensiones especificadas
                })(),
                qr_graduado: graduado.qr_graduado
            };
        });
        res.json(graduadosConDatos);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.updateGraduado = async (req, res) => {
    try {
        const { carnet } = req.params;
        const { nombres,
                apellidos,
                facultad,
                carrera,
                campus,
                frase_emotiva,
                telefono_graduado,
                correo_graduado,
                estado_graduado,    
                destacado_graduado, 
                foto_graduado,
                qr_graduado } = req.body;
        const updateData = {};
       
        if (nombres){
            updateData.nombres = nombres;
        }
        if (apellidos){
            updateData.apellidos = apellidos;
        }
        if (facultad){
            updateData.facultad = facultad;
        }
        if (carrera){
            updateData.carrera = carrera;
        }
        if (campus){
            updateData.campus = campus;
        }
        if(frase_emotiva){
            updateData.frase_emotiva = frase_emotiva;
        }
        if (telefono_graduado){
            updateData.telefono_graduado = telefono_graduado;
        }
        if (correo_graduado){
            updateData.correo_graduado = correo_graduado;
        }
        if (estado_graduado){
            updateData.estado_graduado = estado_graduado;
        }
        if (destacado_graduado){
            updateData.destacado_graduado = destacado_graduado;
        }
        if (foto_graduado){
            updateData.foto_graduado = foto_graduado;
        }else if (req.file){
            updateData.foto_graduado = req.file.path;
        }
        if (qr_graduado){
            updateData.qr_graduado = qr_graduado;
        }

        const graduado = await Graduado.findOneAndUpdate({ carnet: carnet }, updateData, { new: true, runValidators: true });
        if (!graduado) {
            return res.status(404).send('Graduado no encontrado.');
        }

        res.status(200).json({msg:'Datos actualizados con éxito.', graduado});
    } catch (error) {
        console.error('Error al actualizar los datos:', error);
        res.status(500).json({msg:'Error al actualizar los datos.',error});
    }
};


exports.obtenerUngraduado = async (req, res) => {
    try {
        // Verifica si req.params.id es una cadena hexadecimal de 24 caracteres
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "El ID proporcionado no es válido." });
        }

        // Convierte req.params.id en ObjectId
        const id = mongoose.Types.ObjectId(req.params.id);

        // Busca el graduado en la base de datos por su id
        const graduadoEncontrado = await Graduado.findById(id);

        // Verifica si se encontró el graduado
        if (!graduadoEncontrado) {
            // Si no se encontró, devuelve un mensaje de error
            return res.status(404).json({ error: "No se encontró ningún graduado con el id proporcionado." });
        }

        // Si se encontró el graduado, lo devuelve en la respuesta
        res.json(graduadoEncontrado);
    } catch (error) {
        // Si ocurre un error durante la búsqueda, lo maneja
        console.error("Error al intentar obtener el graduado:", error);
        res.status(500).json({ error: "Hubo un error al intentar obtener el graduado." });
    }
};


exports.mostrarPorCarnet = async (req, res) => {
    const carnet = req.params.carnet; //* Obtener el carnet desde los parámetros de la solicitud

    try {
        //* Buscar estudiante por carnet en la base de datos
        const estudiante = await Graduado.findOne({ carnet });

        if (!estudiante) {
            return res.status(404).json({ mensaje: 'Graduado no encontrado' });
        }
        //* Si se encuentra el estudiante, se envía como respuesta
        res.json(estudiante);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

exports.eliminarGraduado = async (req, res) => {
    try {
        let graduado = await Graduado.findById(req.params.id);

        if (!graduado) {
            return res.status(400).json({ msg: "No existe el graduado" });
        }

        // Eliminar la imagen asociada al graduado si existe
        const extensions = ['jpg', 'jpeg', 'png'];
        for (const ext of extensions) {
            const filePath = `public/uploads/${graduado.carnet}.${ext}`;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Graduado.findOneAndDelete({ _id: req.params.id });
        res.json({ msg: 'El graduado ha sido eliminado con éxito' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};