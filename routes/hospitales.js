/*
    Ruta: /api/hospitales
*/
const { Router } = require( 'express' );
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const {getHospitales, creaHospitales, actualizarHospitales, borrarHospitales} = require('../controllers/hospitales');

const router = Router();

// La primera es la ruta de getUsuarios.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque no tiene el ()
router.get( '/', getHospitales );

//Para crear un nuevo usuarios
router.post( '/', 
    [ validarJWT,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos],
    creaHospitales );

//Para actualizar un usuario
router.put( '/:id', 
    [],
    actualizarHospitales );

router.delete( '/:id',
    borrarHospitales );

module.exports = router;
