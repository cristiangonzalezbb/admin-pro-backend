/* 
    Logica que se ejecutara para la ruta que lo ejecuta
    llamado Origen: /index
    Ruta:           /api/hospitales
    Controlador:    /routes/hospitales
*/
const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res) => {

    const medicos = await Medico.find()
                            .populate('usuario', 'nombre img')
                            .populate('hospital', 'nombre img')

    res.json({
        ok: true,
        medicos
    });
} 

const creaMedico = async (req, res = response) => {
   
    const uid = req.uid;

    const medico = new Medico({
        usuario: uid,
        ...req.body});
    
    console.log(uid);

    try {

        const medicoBD = await medico.save();
        res.json({
            ok: true,
            medico: medicoBD
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
} 

const actualizarMedico = async (req, res = response) => {
    try {
        res.json({
            ok: true,
            msg: 'actualizarMedico'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


const borrarMedico = async (req, res = response) => {
    try {
        res.json({
            ok: true,
            msg: 'borrarMedico'
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
    getMedicos,
    creaMedico,
    actualizarMedico,
    borrarMedico };