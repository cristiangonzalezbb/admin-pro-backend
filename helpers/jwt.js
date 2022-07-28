const jwt = require('jsonwebtoken');


const generarJWT = ( uid ) => {

    //Lo genero como promesa, para poder devolver el resolve y el reject
    return new Promise( (resolve, reject) => {
        
        const payload = {
            uid,
        };
    
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '48h'
        }, ( err, token ) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                //console.log(token);
                resolve( token );
            }
        });

    });
}

module.exports = {
    generarJWT
};
