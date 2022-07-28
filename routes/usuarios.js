/*
    Ruta: /api/usuarios
*/
//Permite configurar las rutas
const { Router } = require( 'express' );
//Aqui lo uso el middleware para validar, en este caso uso el check
const { check } = require('express-validator');
//importo el middlewares que validara los campos
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT, 
        validarADMIN_ROLE,
        validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt')

//relaciono con el controles del usuario
const { getUsuarios, 
        crearUsuario, 
        actualizarUsuario, 
        borrarUsuario } = require( '../controllers/usuarios' );

const router = Router();

//Se recomienda que las rutas se manejen solas, para esto
//se crean los controladores, que son los que realizan las llamadas
//consultas, creaciones, modificaciones y todo en otro archivo
//para este caso se crea /controllers/nombre del objeto por ej: usuarios.js

// La primera es la ruta de getUsuarios.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque getUsuarios no tiene el ()
router.get( '/', validarJWT, getUsuarios );

//console.log('Estoy dentro de usuarios routes');
//Aqui utilizo el middleware para usar el express-validator
//y verificar que lo que envio es correcto
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmM2M2E3MGU1ZmVjNTM2NzA1MDJlMmMiLCJpYXQiOjE2NTcxNTgyNTYsImV4cCI6MTY1NzMzMTA1Nn0.yviPxFB81D9me-5YZSWUXCnIQbzwtE_0EbLYUFCyjGA
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MmM2M2IzMmE1YTgyZDRhMDhmYzE2NmQiLCJpYXQiOjE2NTcxNTg0NTAsImV4cCI6MTY1NzMzMTI1MH0.OlYmAlbfvQbEXSFK3XzE3MB2swZ3ghBkb4KxtGHPuro
//Para crear un nuevo usuarios
router.post( '/', 
    [ 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,
    ],
    crearUsuario );

//Para actualizar un usuario
router.put( '/:id', 
    [ 
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos,
    ],
    actualizarUsuario );

//Para eliminar un usuario
router.delete( '/:id',
    [validarJWT, validarADMIN_ROLE],
    borrarUsuario
);

module.exports = router;