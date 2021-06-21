
/* 
    Logica que se ejecutara para la ruta que lo ejecuta
    llamado Origen: /index
    Ruta:           /api/login
    Controlador:    /routes/login
*/

const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helper/jwt');
const { googleVerify } = require('../helper/google-verify');

const login = async (req, res = response) => {

    const { email, password } = req.body;
    // const usuario = await Usuario.find({}, 'nombre email role google ');

    
    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne( {email} );
        if ( !usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Mail no valida'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuarioDB.id );
        // console.log('vuelta', token);
        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        }); 
        
    }
} 


const googleSignIn = async (req =  require,  res = response) => {

    const googleToken =  req.body.token;
    
    try {
        
        const {name, email, picture} = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne( {email} );
        let usuario;
        if ( !usuarioDB) {
            //Si no existe
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            })
        }else {
            // Existe usuario
            usuario = usuarioDB;
            usuario.google= true;
        }
        //Grabo en la base de datos
       await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok:true,
            token
        });    
    } catch (error) {
        res.status(401).json({
            ok:false,
            msg: 'Token no es correcto'
        });
    }
    
    }

const renewToken = async (req =  require,  res = response) => {
    
    const uid = req.uid;
    
    //Obtener el usuario por UID
    const usuario = await Usuario.findById( uid );

    //Generar el TOKEN - JWT
    const token = await generarJWT( uid );
    res.json({
        ok:true,
        token,
        usuario
    }); 

}
module.exports = {
    login,
    googleSignIn,
    renewToken
}