const path = require('path');
const fs = require('fs');

const { response, request } = require('express');
const { actualizarImagen } = require('../helper/actualizar-imagen');
const { v4: uuidv4 } = require('uuid');

const fileUpload = (req = request, res = response) => {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    //Validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if ( !tiposValidos.includes(tipo) ){
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital'
        });
    }

    // Validar que existe un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        })
      }

    // Procesar la Imagen...
      const file = req.files.imagen;
      console.log('file',file);

      const nombreCortado = file.name.split('.'); //.pop().toLowerCase(); //wolverine.1.3.jpg
      const extensionArchivo = nombreCortado [ nombreCortado.length - 1 ];
      console.log('nombreCortado',nombreCortado);
      console.log('extensionArchivo',extensionArchivo);

    //Validar extension
    const extencionesValidas = ['png','jpg','jpeg','gif'];
    if ( !extencionesValidas.includes( extensionArchivo ) ) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    // Generar el nombre del Archivo
    const nombreArchivo = `${uuidv4()}.${ extensionArchivo }`;


    // const date = new Date();
    // const year = date.getFullYear();
    // const month = date.getMonth();
    // const day = date.getDate();
    // const hours = date.getHours();
    // const minutes = date.getMinutes();
    // const seconds = date.getSeconds();
    // const nombreArchivo = `${ year }-${ month }-${ day }-${ hours }-${ minutes }-${ seconds }.${ extensionArchivo }`;

    console.log('nombreArchivo', nombreArchivo);
    // path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo }`;
    console.log('path', path);

    // Mover la Imagen a la carpeta seleccionada
    file.mv(path, (err) => {
        if (err){
            console.log('Este es el error que aparece ---->',err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la image'
            });
        }

    // Actualizar base de datos
    actualizarImagen(tipo, id, nombreArchivo);
    
    res.json({
        ok: true,
        msg: 'Archivo subido',
        nombreArchivo
       });

    });
}

const retornaImagen = (req = request, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );

    // imagen por Defecto
    if ( fs.existsSync ( pathImg ) ){
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-img.png` );
        res.sendFile( pathImg );
    }

}


module.exports = {
    fileUpload,
    retornaImagen
}