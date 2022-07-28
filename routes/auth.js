/*
    Path: '/api/login'
*/
const { Router } = require('express');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

//console.log('Estoy dentro de Auth routes');
// La primera es la ruta de getUsuarios.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque no tiene el ()
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login );

router.post( '/google',
    [
        check('token', 'El token de Google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
)

router.get( '/renew',
    validarJWT,
    renewToken
)






module.exports = router;
