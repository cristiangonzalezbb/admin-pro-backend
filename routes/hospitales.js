/*
    Hospitales
    ruta: '/api/hospitales'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
} = require('../controllers/hospitales')


const router = Router();

// La primera es la ruta de getHospitales.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque no tiene el ()
router.get( '/', getHospitales );

//Para crear un nuevo Hospital
router.post( '/', 
    [ validarJWT,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos
    ],
    crearHospital );

//Para actualizar un Hospital
router.put( '/:id', 
    [validarJWT,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos
    ],
    actualizarHospital );

//Para Borrar Hospital
router.delete( '/:id',
    validarJWT,
    borrarHospital );

module.exports = router;
