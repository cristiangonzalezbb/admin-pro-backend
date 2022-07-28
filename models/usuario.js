const { Schema, model } = require('mongoose');
//Tambien puede ser
const mongoose = require('mongoose')
//mongoose.Model
//mongoose.Schema

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true},
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }
})

//Esta funcion permite usar el _id de mongo como id
UsuarioSchema.method('toJSON', function(){
    const {__v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

//Ahora implementamos el modelo
//En la base de datos se crear la tabla Usuarios con s, en plural
//esto lo hace automatico mongoose
module.exports = model('Usuario', UsuarioSchema);