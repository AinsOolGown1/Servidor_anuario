const express = require('express');
const Login = require('../controller/auth.controller');
const router = express.Router();
const JWTvalidator = require('../Middleware/jwtValidator')
const rolValidator = require('../Middleware/rolValidator')

router.post('/crearUsuario', Login.crearUsuario);

//Ingresar los datos del login
router.post('/LoginAuth', Login.LoginAuth)

//Actualizar contraseña de usuario
router.put('/updatePassword/:id', Login.updatePassword);

module.exports = router;