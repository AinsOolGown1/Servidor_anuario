const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')

//* Inicialización
dotenv.config();
const app = express();
const port = process.env.PORT || '4300';

app.use(express.json({limit:'100mb'}))

app.use(cors());
app.use(bodyParser.json());

app.use(express.json()); //* Habilitamos el uso del formato JSON en las solicitudes
app.use(express.urlencoded({ extended: true })); //* Para procesar form data

app.use(express.static('public'));

//*redirigir cualquier URL al index nuevamente
app.get('/:universalurl',(req, res) =>{
    res.redirect(`http://localhost:${port}`)
})

app.use(express.static('public/uploads')); //* Establecemos la carpeta public para acceder a las imágenes
app.use('/uploads_coleccion_fotos', express.static(path.join(__dirname, 'public/uploads_coleccion_fotos')));

//* Conexion con mongoDB
conectarDB()

app.use('/api/graduados', require('./routes/agregar_graduados'));
app.use('/api/coleccion-fotos', require('./routes/agregar_coleccionfotos'));
app.use('/api/filtro_gallery', require('./routes/filtroFotos'));
app.use('/api/carga_masiva', require('./routes/cargamasiva'));
app.use('/api/filtro', require('./routes/filtroCarrerasFacultad'))


//* Definimos ruta principal
app.listen(port, () =>{
    console.log(`El servidor esta corriendo perfectamente | http://localhost:${port}`);
})