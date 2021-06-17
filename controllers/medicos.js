/* 
    Logica que se ejecutara para la ruta que lo ejecuta
    llamado Origen: /index
    Ruta:           /api/hospitales
    Controlador:    /routes/hospitales
*/
const { request, response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req = request, res = responder) => {

    const medicos = await Medico.find()
                            .populate('usuario', 'nombre img')
                            .populate('hospital', 'nombre img')

    res.json({
        ok: true,
        medicos
    });
} 

const creaMedico = async (req = request, res = response) => {
   
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

const actualizarMedico = async (req = request, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById ( id );

        if ( !medico ) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }
        const hospitalActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true })

        res.json({
            ok: true,
            hospitalActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


const borrarMedico = async (req = request, res = response) => {
    const id = req.params.id;
        
    try {

        const medicoDB = await Medico.findById( id );
        if ( !medicoDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un medico por ese id'
            });
        }   

        await Medico.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Medico Eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = { 
    getMedicos,
    creaMedico,
    actualizarMedico,
    borrarMedico };