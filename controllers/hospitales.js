/* 
    Logica que se ejecutara para la ruta que necesita realizar las funciones
    llamado Origen: /index
    Ruta:           /api/hospitales
    Controlador:    /routes/hospitales
*/
const { request ,response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async (req = request, res = response) => {

    //populate(), que le permite hacer referencia a documentos en otras colecciones
    const hospitales = await Hospital.find()
                                    .populate('usuario','nombre img');

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async(req, res = response) => {

    const uid = req.uid;

    const hospital = new Hospital({
        usuario: uid,
        ...req.body});
    
    console.log(uid);

    try {

        const hospitalDB = await hospital.save();
        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
} 

const actualizarHospital = async (req = request, res = response) => {
    //id del Hospital
    const id  = req.params.id;
    //uid del usuario
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
            //Recupero todo lo que tengo en el body
            ...req.body,
            //Además, paso el uid que viene del const uid = req.uid;
            //que fue generado en validarJWT
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


const borrarHospital = async (req, res = response) => {
    
    const id = req.params.id;
        
    try {

        const hospital = await Hospital.findById( id );
        if ( !hospital){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital por ese id'
            });
        }   

        await Hospital.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}



module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}