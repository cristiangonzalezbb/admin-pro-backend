
/* 
    Logica que se ejecutara para la ruta que necesita realizar las funciones
    llamado Origen: /index
    Ruta:           /api/login
    Controlador:    /routes/login
*/

const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
//Se coecta al helper que genera los token
const { generarJWT } = require('../helpers/jwt');
//Viene del helpers que cuenta con las funciones entregadas por google
const { googleVerify } = require('../helpers/google-verify');

const { getMenuFrontEnd } =  require('../helpers/menu-frontend');


const login = async( req, res = response ) => {

    const { email, password } = req.body;
    // const usuario = await Usuario.find({}, 'nombre email role google ');

    
    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuarioDB.id );
        // console.log('vuelta', token);
        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        }); 
        
    }
} 


const googleSignIn = async (req,  res = response) => {

    const googleToken =  req.body.token;
    
    try {
        
        const {name, email, picture} = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });
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
            usuario.google = true;
        }
        //Grabo en la base de datos
       await usuario.save();

        //Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok:true,
            token,
            menu: getMenuFrontEnd(usuario.role)
        });    
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }
    
    }


const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT( uid );

    // Obtener el usuario por UID
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontEnd(usuario.role)
    });

}




module.exports = {
    login,
    googleSignIn,
    renewToken
}