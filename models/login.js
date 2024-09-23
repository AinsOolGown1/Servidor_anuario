const mongoose = require('mongoose');

const Auth_LoginSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    rol:{
        type: String,
        required: true
    },
    estado:{
        type: Boolean,
        required: true
    },
})

module.exports = mongoose.model('AuthLogin', Auth_LoginSchema);