/* 
    Logica que se ejecutara para la ruta que lo ejecuta
    llamado Origen: /index
    Ruta:           /api/hospitales
    Controlador:    /routes/hospitales
*/
const { request ,response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async (req = request, res) => {

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

const actualizarHospitales = async (req = request, res = response) => {
    const id  = req.params.id;
    const uid = req.uid;
    console.log(uid);

    try {
        const hospital = await Hospital.findById( id );

        if ( !hospital ) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado por id',
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true } );

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


const borrarHospitales = async (req, res = response) => {
    
    const id = req.params.id;
        
    try {

        const hospitalDB = await Hospital.findById( id );
        if ( !hospitalDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            });
        }   

        await Hospital.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Hospital Eliminado'
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
    getHospitales,
    creaHospitales,
    actualizarHospitales,
    borrarHospitales };