const { response, request } = require('express')
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = (req = request, res = response, next) => {
    
    const token = req.header('x-token');
    // console.log(token)

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }
    try {
        //Verifica el token creado
        //Este token se genera al momento de llamar un usuario
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        // console.log( uid );
        req.uid = uid;

        //Si no incorporamos el next, no sale de esta función
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

const validarADMIN_ROLE = async(req = request, res = response, next) => {
    const uid = req.uid;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });    
        }
        if (usuarioDB !== 'ADMIN_ROLE'){
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Habla con el Administrador'
        });
    }
} 

const validarADMIN_ROLE_o_MismoUsuario = async(req = request, res = response, next) => {
    const uid = req.uid;
    const id = req.params.id;

    //console.log('uid', uid, 'id', id);
    //El id viene como parte del segmento el url ('/:id', )
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });    
        }
        
        //Tiene que ser ADMIN_ROLE o el mismo usuario
        if (usuarioDB.role === 'ADMIN_ROLE' || id === uid ){
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Habla con el Administrador'
        });
    }
} 
module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}