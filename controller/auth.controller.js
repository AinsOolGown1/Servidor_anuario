const JWTGENERATE = require('../utils/jwtgenertare');
const bcrypt = require('bcrypt');
const Auth = require('../models/login');

exports.LoginAuth = async(req, res) =>{
    const { email, password} = req.body;

    try {
        const user = await Auth.findOne({email})
        
        if(!user){
            return res.status(400).json({
                msg: `No existe un usuario con el correo especificado ${email}`
            });
        }
    
        if(user.estado === false){
            return res.status(400).json({
                msg: `El usuario no existe o no se encuentra activo`
            });
        }
    
        const validPassword = bcrypt.compareSync(password, user.password);
    
        if (!validPassword) {
            return res.status(400).json({
                msg: `Constraseña incorrecta`
            });
        }
    
        //Generar JWT
    
        const token = await JWTGENERATE(user.id);
        const {estado, ...userToken} = user;
    
        res.json({userToken, token});
        
    } catch (error) {
        res.json({msg: error.message})
    }
};

exports.updatePassword = async(req, res) => {
    
    const { id } = req.params;
    const { password } = req.body;

    try {

        if(password === ""){
            return res.status(400).json({msg: "La contraseña no puede ser vacía"})
        }
        
        if(password.length < 8){
            return res.status(400).json({msg: "La contraseña debe tener mínimo 8 carácteres"})
        }

        const salt = bcrypt.genSaltSync();
        const newPasswordHash = bcrypt.hashSync(password, salt);
    
        const user = await Auth.findByIdAndUpdate(
            id,{
                password: newPasswordHash
            },{
                new: true
            }

        );
    
        res.json({msg:'Contraseña actualizada', user});
        
    } catch (error) {
        res.json({msg: error.message})
    }

};

exports.crearUsuario = async (req,res) =>{
    const {password, ...data}  = req.body;

    try {
        const salt = bcrypt.genSaltSync();
        const passwordHash = bcrypt.hashSync(password, salt);
    
        const nuevoUsuario = await Auth.create({...data, password: passwordHash})
    
        res.json(nuevoUsuario);
        
    } catch (error) {
        res.json({msg: error.message})
    }
}