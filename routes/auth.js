/*
    Ruta: /api/login
*/
const { Router } = require( 'express' );
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { login, googleSignIn } = require('../controllers/auth');

const router = Router();

// La primera es la ruta de getUsuarios.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque no tiene el ()
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login );

router.post( '/google', [
    check('token', 'El token de Google es obligatorio').not().isEmpty(),
    validarCampos
], googleSignIn );

module.exports = router;
