const JWT = require('jsonwebtoken')

const JWTgenerate = (id) => {
    return new Promise ((resolve, reject) =>{
        const payload = {id};

        JWT.sign(payload, process.env.PRIVATEKEY || '', {
            expiresIn: '5h'
        },(err, token) =>{
            if(err){
                console.log(err);
                reject('No se logro generar el JWT');
            }else{
                resolve(token)
            }
        }
    )
    })
}

module.exports = JWTgenerate;