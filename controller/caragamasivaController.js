const path = require('path')
const fs = require('fs')
const Graduados = require('../models/GraduadoEstudent');

exports.CargaMasivaCSV = async (req, res) =>{

    const filename = req.file?.originalname ?? 'importador';
    const file_name =path.parse(filename).name;
    const fileExtension = path.parse(filename).ext;
    const ruta_archivo = path.join(__dirname, `../public/uploads_Excel/${file_name}/${file_name}${fileExtension}`);

    //*Validar si el archivo es csv

    if(!req.file?.originalname || file_name.match(/\.(csv)$/)){
        res.sendStatus(400).json({msg: 'El archivo no es un .csv o no existe!'})
    }

    //*leer el archivo csv
    let csv_data = fs.readFileSync(ruta_archivo, {encoding: 'utf-8'});

    //*Convertir el archivo csv en json
    const array_data = csv_data.toString().split("\n");

    let json_object = [];

    let headers = array_data[0].split(",")

    headers = headers.map((item) => item.replace(/\s/g, ''));

    let arrayComparar = [
        "carnet",
        "nombres",
        "apellidos",
        "facultad",
        "carrera",
        "campus",
        "frase_emotiva",
        "telefono_graduado",
        "correo_graduado",
        "year_graduado",
        "destacado_graduado",
        "qr_graduado"
    ];

    const funcionCompararHeaders = (array_entrada) => {

        let arr1 = array_entrada.toString();
        let arr2 = arrayComparar.toString();

        if (arr1 === arr2){
            return true;
        }else{
            return false;
        }

    }
    
    if(funcionCompararHeaders(headers) === false){
        res.status(400).json({msg: 'El archivo no posee los headers correctos!', headers_on_file:headers,headers_to_compare: arrayComparar});
    }else if(funcionCompararHeaders(headers) === true){
        //*Recorrer el array y crear un objeto de tipo json
        for(let i=1; i<array_data.length; i++){

            //*Obtener datos de cada linea
            let data = array_data[i].split(",");

            //*Validar la longitud de los datos
            if(data.length !== headers.length){
                console.error(`Line ${i} no es valida`)
                continue;
            }

            let objeto_fila = {};

            for(let j=0; j < data.length; j++){
                if(data[j].trim() !== '""'){
                    objeto_fila[headers[j].trim()] = data[j].trim();
                }
            }
            json_object.push(objeto_fila)
        }
        
        console.log(json_object)
        //*Inicio de formateo en los datos
        try {

            //!verificar repetidos por carnet en el archivo
            const array_numeros_carnet = json_object.map(item_carnet => item_carnet.carnet).flat(1);
            const repetidos_carnet_documento = [...new Set(array_numeros_carnet.filter((item, index) => array_numeros_carnet.indexOf(item) !== index))];

            //!verificar repetido por carnet en base de datos
            const empleados_repetidos_database = await Graduados.find({carnet: { $in: array_numeros_carnet}}).select('carnet nombres apellidos')

            if(empleados_repetidos_database.length !== 0 || repetidos_carnet_documento.length !== 0 ){
                res.status(400).json({
                    msg:'Elementos Repetidos en Base de Datos o CSV cargado',
                    repetidos_carnet_documento: repetidos_carnet_documento, 
                    repetidos_carnet_database: empleados_repetidos_database
                })
            }else{

                let copia_objeto_datos = json_object.map(item =>{
    
                    let flag_destacado;
    
                    if(item.destacado_graduado === "si"){
                        flag_destacado = true
                    }else{
                        flag_destacado = false
                    }
    
                    return {
                        carnet: parseInt(item.carnet),
                        nombres: item.nombres,
                        apellidos: item.apellidos,
                        facultad: item.facultad,
                        carrera: item.carrera,
                        campus: item.campus,
                        frase_emotiva: item.frase_emotiva,
                        year_graduado: parseInt(item.year_graduado),
                        telefono_graduado: item.telefono_graduado,
                        correo_graduado: item.correo_graduado,
                        estado_graduado: true,
                        destacado_graduado: flag_destacado,
                        qr_graduado: item.qr_graduado
    
                    }
                })
    
                const datos_guardados = await Graduados.insertMany(copia_objeto_datos)
    
                res.json({msg: 'Archivo cargado con éxito, se cargaron los graduados'})
            }

            fs.writeFile(path.join(__dirname, `../public/uploads_Excel/${file_name}/${file_name}.json`), JSON.stringify(json_object), (err) => {
                if (err) {
                    console.error(err)
                }
            })
            
        } catch (error) {
            res.sendStatus(500).json({msg: error.message});
        }
    }
}