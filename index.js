require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } =  require('./database/config');
// const { getUsuarios } = require('./controllers/usuarios');

// Crear el servidor de express
const app = express();

//Configurar CORNS
app.use( cors() );

//Lectura y parseo del body
app.use( express.json() );

// Base de datos
dbConnection();

// console.log(process.env.PORT);

//Rutas
// La 1° es como se llamara, por ejemplo desde Postman
// La 2° es lo que se ejecuta, cuando se selecciona la ruta
app.use( '/api/usuarios',   require('./routes/usuarios') );
app.use( '/api/hospitales', require('./routes/hospitales') );
app.use( '/api/medicos',    require('./routes/medicos.js') );
app.use( '/api/todo',    require('./routes/busquedas') );
app.use( '/api/login',      require('./routes/auth') );
app.use( '/api/upload',      require('./routes/uploads') );

app.listen (process.env.PORT, () => {
    console.log('Servidor en el puerto '+ process.env.PORT);
})