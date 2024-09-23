const express = require('express');

const ROLvalidator = () =>{
    return (req, res, next ) => {
        if(!req.user){
            return res.status(500).json({
                msg: 'No se puede verificar un usuario sin token genereado'
            });
        }

        const { rol } = req.user;
        
        if (!roles.includes(rol)){
            return res.status(401).json({
                msg: `El servicio requiere unos de estos roles ${roles}`
            });
        }
        next();
    }
}

module.exports = ROLvalidator;