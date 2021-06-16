//File System: Paquete para leer las carpetas
const fs = require('fs');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');


const borrarImagen = (path) =>{
    
    if ( fs.existsSync( path ) ) {
        //Borrar la imagen anterior
        fs.unlinkSync( path );
    }
}
const actualizarImagen = async (tipo, id, nombreArchivo) => {
    let pathViejo = '';
    // console.log('Vamos Bien');
    switch ( tipo ) {
        case 'medicos':
            const medico = await Medico.findById( id );
            if ( !medico ) {
                console.log('No es médico por id');
                return false;
            }
            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            medico.save();
            return true;
        break;

        case 'hospitales':
            const hospital = await Hospital.findById( id );
            if ( !hospital ) {
                console.log('No es Hospital por id');
                return false;
            }
            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            hospital.save();
            return true;            
        break;
        case 'usuarios':
            const usuario = await Usuario.findById( id );
            if ( !usuario ) {
                console.log('No es Usuario por id');
                return false;
            }
            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            usuario.save();
            return true;              
        break;
    }
}


module.exports = {
    actualizarImagen
};
