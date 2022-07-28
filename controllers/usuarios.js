/* 
    Logica que se ejecutara para la ruta que necesita realizar las funciones
    llamado Origen: /index
    Ruta:           /api/usuarios
    Controlador:    /routes/usuario
*/
//Al importar el response o/y el request , se optendra el tipado de la funcion
//para usarlo luego con el res = response
//esto desestructura con {}
const { response, request } = require('express');
//Se importa el encriptador para proteger datos sensibles
//no esta con {} porque es una importación por default
const bcrypt = require('bcryptjs');
//Importo el modelo asociado
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => {

    const desde = Number( req.query.desde ) || 0;
    //De esta forma se hace la consulta 1:1
    // const usuario = await Usuario.find( {}, 'nombre email role google ')
    //                         .skip( desde )
    //                         .limit( 5 );
    // const total = await Usuario.count();

    //De esta forma se realiza como una sola consulta
    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
            .skip( desde )
            .limit( 5 ),

        Usuario.countDocuments()
    ]);


    res.json({
        ok: true,
        usuarios,
        //uid: req.uid,
        total
    });

}

const crearUsuario = async(req, res = response) => {

    //Como leer el body, el que viene en res
    const {email, password, nombre } = req.body;
    //const email     = req.body.email;
    //const password  = req.body.password;
    //const nombre    = req.body.nombre;
    //  console.log( req.body );

    //console.log('desde el body email', email);
    //console.log('desde el body password', password);
    //console.log('desde el body nombre', nombre);
    //console.log('Estoy creando un nuevo usuario');
    try {
        //Valido que el campo requerido, sea unico
        //Realiza una busqueda por el campo email
        const existeEmail = await Usuario.findOne( { email } );

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        //console.log('datos del usuario', usuario);
        //console.log('datos del password', password);

        //Encriptar contraseña
        //esto es un hash de una sola via
        //Se genera un numero aleatorio
        const salt = bcrypt.genSaltSync();
        //console.log('Codigo Salt', password, salt);
        //Fuciona los datos para generar la password
        usuario.password = bcrypt.hashSync(password, salt);

        //Guarda usuario en la base de datos
        //await: Espera a que esta promera termine
        //Para poder utilizarlo, debe estar en una funcion async
        await usuario.save();
    
        //Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        //Solo se puede enviar una sola vez la respuesta en el 
        //bloque de codigo
        res.json({
            ok: true,
            usuario, 
            token
        });

    } catch (error) {
        //console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
} 

const actualizarUsuario = async (req, res = response) => {
    //TODO: Validar token y comprobar si es el usuario correcto

    //El id viene como parte del segmento el url ('/:id', )
    const uid = req.params.id;
    // console.log(uid);

    try {
        //Realiza una busqueda por el id
        const usuarioDB = await Usuario.findById( uid );
        // const { nombre, role, email } = req.body;

        if ( !usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }   

        //Actualizaciones
        //Elimino los campos de password, google y email de la lista de campos
        //Estos datos vienen del cuerpo del mensaje
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
            //Con esto devuelvo a ...campos, el campo email
            campos.email = email;
            } 
        else if ( usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no pueden cambiar su correo'
            });
        }

        //Se reemplaza por la constante de campos y elimino los campos
        //que no quiero actualizar en la base de datos
        //const campos = req.body;
        // delete campos.password;
        // delete campos.google;

        //Cuando realizamos una actualización, monggose devuelve el registro que se esta actualizando
        //para que devuelva el registro actualizado, se debe incorporar { new: true }
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            //aqui nos devuelve el registro actualizado siempre y cuando este { new: true }
            usuario: usuarioActualizado
        });

    } catch (error) {
        //console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}


const borrarUsuario = async (req, res = response) => {
    //TODO: Validar token y comprobar si es el usuario correcto

    //El id viene como parte del segmento el url ('/:id', )
    const uid = req.params.id;
    // console.log(uid);

    try {

        const usuarioDB = await Usuario.findById( uid );

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
        //console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = { 
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
 };