const { response, request } = require('express')
const jwt = require('jsonwebtoken');

const validarJWT = (req = request, res = response, next) => {
    
    const token = req.header('x-token');
    // console.log(token)

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }
    try {
        
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        // console.log( uid );
        req.uid = uid;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }

}

module.exports = {
    validarJWT
}