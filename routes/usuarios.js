/*
    Ruta: /api/usuarios
*/
const { Router } = require( 'express' );
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')
const { getUsuarios, creaUsuarios, actualizarUsuario, borrarUsuario } = require( '../controllers/usuarios' );

const router = Router();

// La primera es la ruta de getUsuarios.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque no tiene el ()
router.get( '/', validarJWT, getUsuarios );

//Para crear un nuevo usuarios
router.post( '/', 
    [ 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,
    ],
    creaUsuarios );

//Para actualizar un usuario
router.put( '/:id', 
    [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos,
    ],
    actualizarUsuario );

router.delete( '/:id',
      validarJWT,
      borrarUsuario );

module.exports = router;