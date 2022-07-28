//Al importar el response o/y el request , se optendra el tipado de la funcion
//para usarlo luego con el req = request y res = response
//esto desestructura con {}
const { response, request } = require('express')
//como usamos el check en usuarios.router
//con esto podemos capturar el resultado de esas validaciones
const { validationResult } = require('express-validator')

const validarCampos = (req = request, res = response, next) => {
    
    const errores = validationResult( req );
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            //Devoluciones: un objeto donde las claves son los nombres de 
            //los campos y los valores son los errores de validación
            errors: errores.mapped()
        })
    }

    next();
}

module.exports = {
    validarCampos
}