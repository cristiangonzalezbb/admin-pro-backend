/* 
    Logica que se ejecutara para la ruta que lo ejecuta
    llamado Origen: /index
    Ruta:           /api/usuarios
    Controlador:    /routes/usuario
*/
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helper/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number( req.query.desde ) || 0;
    //De esta forma se hace la consulta 1:1
    // const usuario = await Usuario.find({}, 'nombre email role google ')
    //                         .skip( desde )
    //                         .limit( 5 );
    // const total = await Usuario.count();

    //De esta forma se realiza como una sola consulta
    const [usuario, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
            .skip( desde )
            .limit( 5 ),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuario,
        total
    });
} 

const creaUsuarios = async (req, res = response) => {
    const {email, password, nombre } = req.body;
    //  console.log( req.body );
   
    try {
        const existeEmail = await Usuario.findOne( { email } );

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });    
        }
        const usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Guarda usuario
        await usuario.save();
    
        //Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario, 
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
} 

const actualizarUsuario = async (req, res = response) => {
    //TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;
    // console.log(uid);

    try {

        const usuarioDB = await Usuario.findById( uid );
        // const { nombre, role, email } = req.body;

        if ( !usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }   

        //Actualizaciones
        //Elimino los campos de password y google de la lista de campos
        const {password, google, email, ...campos} = req.body;

        if ( usuarioDB.email !== email ) {
            const existeEmail = await Usuario.findOne( { email } );
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                }); 
            }
        }

        if ( !usuarioDB.google){
            campos.email = email;
        } else if ( usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no pueden cambiar su correo'
            });
        }

        //Se reemplaza por la constante de camopos
        // delete campos.password;
        // delete campos.google;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


const borrarUsuario = async (req, res = response) => {
    //TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;
    // console.log(uid);

    try {

        const usuarioDB = await Usuario.findById( uid );
        // const { nombre, role, email } = req.body;

        if ( !usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }   

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
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
    getUsuarios,
    creaUsuarios,
    actualizarUsuario,
    borrarUsuario
 };