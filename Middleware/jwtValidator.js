const express = require('express')
const JWT = require('jsonwebtoken');
const AuthModel = require('../models/login')

const JWTvalidator = async(req, res, next) =>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: `No hay token en la petición`
        });
    }

     // Verificar que la clave privada este definida
     const privateKey = process.env.PRIVATEKEY;

     if (!privateKey) {
         return res.status(500).json({
             msg: 'La clave privada no está configurada en las variables de entorno'
         });
     }

    try {
        const data = JWT.verify(token, privateKey);
        req.id = data.id;
        //Leer user correspondiente al ID
            const user = await AuthModel.findOne({
                where: {id: req.id}
            });
            // Comprueba la existencia del usario
            if(!user){
                return res.status(401).json({
                    msg: `Token no válido - Usuario no existe en el DB`
                });
            }

            //Comprueba el estado del usuario
            if(user.estado === false){
                return res.status(401).json({
                    msg: `Token no válido - Usuario inactivo`
                });
            }

            req.user = user;
            next();

        
    } catch (error) {
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
}

module.exports = JWTvalidator;