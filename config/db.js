const mongoose = require('mongoose');
require('dotenv').config();

const conectarDB = async () => {
  try {
    const uri = process.env.DB_MONGO;  // Asegurarse que la variable de entorno esté definida
    if (!uri) {
      throw new Error('La URI de la base de datos no está definida en las variables de entorno.');
    }
    await mongoose.connect(uri);  // Sin las opciones obsoletas
    console.log('Conexión a la BD exitosa');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1); // Detenemos la aplicación
  }
};

module.exports = conectarDB;
