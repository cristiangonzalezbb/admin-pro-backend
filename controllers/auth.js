
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

module.exports = {
    login
}