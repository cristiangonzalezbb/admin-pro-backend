
/* 
    Logica que se ejecutara para la ruta que lo ejecuta
    llamado Origen: /index
    Ruta:            /api/todo/:busqueda
    Controlador:    /routes/busquedas
*/

const { response, request } = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

// const bcrypt = require('bcryptjs');
// const { generarJWT } = require('../helper/jwt');

const getTodo = async (req = request, res = response) => {

    const busqueda = req.params.busqueda;
    const regex =  new RegExp( busqueda, 'i');

    //De esta forma se hace la consulta 1:1
    // const usuarios      = await Usuario.find({nombre: regex});
    // const medicos       = await Medico.find({nombre: regex});
    // const hospitales    = await Hospital.find({nombre: regex});

    //De esta forma se realiza como una sola consulta
    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({nombre: regex}),
        Medico.find({nombre: regex}),
        Hospital.find({nombre: regex})
    ]);

   
    try {
        res.json({
            ok: true,
            usuarios,
            medicos,
            hospitales
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        }); 
        
    }
} 

const getDocumentosColeccion = async (req = request, res = response) => {

    const tabla     = req.params.tabla;
    const busqueda  = req.params.busqueda;
    const regex     =  new RegExp( busqueda, 'i');

    console.log(tabla);

    let data= [];

    switch ( tabla ){
        case 'medicos':
            data = await Medico.find({nombre: regex})
                               .populate('usuario', 'nombre img')
                               .populate('hospital', 'nombre img');
        break;
        case 'hospitales':
            data = await Hospital.find({nombre: regex})
                                 .populate('usuario', 'nombre img');
        break;
        case 'usuarios':
            data = await Usuario.find({nombre: regex})
                                .populate('usuario', 'nombre img');
        break;

        default:
            return res.status(400).json({
                ok:false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });
    }

    return res.status(200).json({
        ok:true,
        resultados: data
    });

} 

module.exports = {
    getTodo,
    getDocumentosColeccion
}