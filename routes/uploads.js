/*
    Ruta: /api/upload
*/
const { Router } = require( 'express' );
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt')
const { fileUpload, retornaImagen } = require("../controllers/uploads")

const router = Router();

//Para cargar archivos
router.use( expressFileUpload());

// La primera es la ruta de getUsuarios.
// La segunda es el controlador, no lo ejecuta solo envia la referencia, porque no tiene el ()
router.put( '/:tipo/:id', validarJWT, fileUpload );
router.get( '/:tipo/:foto', retornaImagen );
module.exports = router;
