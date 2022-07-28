//Importa las variables de entorno
require('dotenv').config();

//Express es una infraestructura de aplicaciones web Node.js 
//mínima y flexible que proporciona un conjunto sólido de 
//características para las aplicaciones web y móviles.
const express = require('express');

//CORS es un paquete de node.js para proporcionar un Connect
const cors = require('cors');

//Importo la configuración de la conexion desde database/config.json
//El cual se conecta a Mongoose
const { dbConnection } =  require('./database/config');
// const { getUsuarios } = require('./controllers/usuarios');

// Crear el servidor de express
const app = express();

//Configurar CORNS
//Esto es conocido como un middleware
//Esta función se ejecutara siempre, para todas las lineas
//de codigo que siguen hacia abajo.
//Con esto se valida la conexion y el buen funcionamiento
app.use( cors() );

//Lectura y parseo del body
//Este middleware permite generar el body para ingresar
//los datos necesarios para enviar al llamado
//en el controllers. Campos para enviar a grabar, modificar o eliminar
app.use( express.json() );

// Base de datos
//Esto esta en database/config.js
dbConnection();

//Directorio Publico
//Cualquier persona podrá ver el contenido que despliega aqui
//public = directorio creado como publico
app.use(express.static( 'public' ));

//console.log('Variable de entorno Port', process.env.PORT);
//console.log('Variable de Conexion', process.env.DB_CNN);

//Rutas
// La 1° es como se llamara, por ejemplo desde Postman
// La 2° es lo que se ejecuta, cuando se selecciona la ruta
// Se crea un middleware
app.use( '/api/usuarios',   require('./routes/usuarios') );
app.use( '/api/hospitales', require('./routes/hospitales') );
app.use( '/api/medicos',    require('./routes/medicos') );
app.use( '/api/todo',       require('./routes/busquedas') );
app.use( '/api/login',      require('./routes/auth') );
app.use( '/api/upload',     require('./routes/uploads') );

//app.use( '/api/usuarios',       = app.get('/app/usuarios'
//require('./routes/usuarios') ); = ruta donde encontrar los comandos
//app.get('/app/usuarios', (req, res) => {
//    res.json({
//        ok: true,
//        usuarios: [{
//            id: 123,
//            nombre: 'Fernando'
//        }]
//    })
//});

app.listen (process.env.PORT, () => {
    console.log('Servidor en el puerto '+ process.env.PORT);
})