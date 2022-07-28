//Esto se carga con la instalación de la libreria de google llamada google-auth-library
const { OAuth2Client } = require('google-auth-library');
//Es el id que nos entrego google que tenemos guardado en .env
const client = new OAuth2Client( process.env.GOOGLE_ID );

//Este codigo esta en la documentacion
const googleVerify = async( token ) => {

  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // const userid = payload['sub'];

  // console.log(payload);
  const {name, email, picture} = payload;
  return { name, email, picture };
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}

//verify().catch(console.error);
module.exports = {
    googleVerify
}