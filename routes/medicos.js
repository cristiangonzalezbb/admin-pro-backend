/*
    Ruta: /api/hospitales
*/
const { Router } = require( 'express' );
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const { getMedicos, creaMedico, actualizarMedico, borrarMedico} = require('../controllers/medicos');

const router = Router();

// La primera es la ruta de getUsuarios.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque no tiene el ()
router.get( '/', getMedicos );

//Para crear un nuevo usuarios
router.post( '/', 
    [ validarJWT,
      check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
      check('hospital', 'El hospital id debe de ser válido').isMongoId(),
      validarCampos ],
    creaMedico );

//Para actualizar un usuario
router.put( '/:id', 
    [validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe de ser válido').isMongoId(),
    validarCampos ],
    actualizarMedico );

router.delete( '/:id',
    borrarMedico );

module.exports = router;
