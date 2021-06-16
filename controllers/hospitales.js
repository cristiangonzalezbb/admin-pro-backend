/* 
    Logica que se ejecutara para la ruta que lo ejecuta
    llamado Origen: /index
    Ruta:           /api/hospitales
    Controlador:    /routes/hospitales
*/
const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async (req, res) => {

    const hospitales = await Hospital.find()
                            .populate('usuario', 'nombre img')
    res.json({
        ok: true,
        hospitales
    });
} 

const creaHospitales = async (req, res = response) => {
   
    const uid = req.uid;

    const hospital = new Hospital({
        usuario: uid,
        ...req.body});
    
    console.log(uid);

    try {

        const hospitalBD = await hospital.save();
        res.json({
            ok: true,
            hospital: hospitalBD
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
} 

const actualizarHospitales = async (req, res = response) => {
    try {
        res.json({
            ok: true,
            msg: 'actualizarHospitales'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


const borrarHospitales = async (req, res = response) => {
    try {
        res.json({
            ok: true,
            msg: 'borrarHospitales'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


module.exports = { 
    getHospitales,
    creaHospitales,
    actualizarHospitales,
    borrarHospitales };