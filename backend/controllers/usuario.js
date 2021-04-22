let Usuario = require("../modelo/usuario");
let bcrypt = require("bcrypt-nodejs");

const registrarUsuario = (req, res) => {
  //sacamos los parametros del body del JSON (viene en la API)
  let params = req.body;
  //utilizamos el modelo usuario (pero limpio)
  let usuario = new Usuario();
  //validamos el pass para encriptarlo
  if (params.pass) {
    //Usamos
    bcrypt.hash(params.pass, null, null, function (err, hash) {
      //si se encripta la contraseña
      if (hash) {
        usuario.nombres = params.nombres;
        usuario.apellidos = params.apellidos;
        usuario.edad = params.edad;
        usuario.correo = params.correo;
        usuario.pass = hash;
        usuario.rol = params.rol;
        //enviamos al modelo para registrar en MongoDB
        usuario.save((err, saveUsuario) => {
          if (err) {
            //si hay un error
            res.status(500).send({ err: "No se registro el usuario" });
          } else {
            //si el proceso se completo
            res.status(200).send({ usuario: saveUsuario });
          }
        });
      } else {
        //damos respuesta al error de encriptación si lo hay
        res
          .status(400)
          .send({ err: "no se encripto el pass, y no se registro el usuario" });
      }
    });
  } else {
    //validación de datos del json
    res.status(405).send({ err: "no se guardo ningun dato" });
  }
};

//Login

const login = (req, res) => {
  //variable para los parametros que llegan
  let params = req.body;
  //buscamos el usuario en DB
  Usuario.findOne({ correo: params.correo }, (err, datosUsuario) => {
    if (err) {
      res.status(500).send({ mensaje: "Error del servidor" });
    } else {
      if (datosUsuario) {
        bcrypt.compare(params.pass, datosUsuario.pass, function (err, confirm) {
          if (confirm) {
            if (params.getToken) {
              res.status(200).send({Usuario: datosUsuario});
            } else {
              res.status(200).send({Usuario: datosUsuario, mensaje: "sin token"});
            }
          } else {
            res.status(401).send({mensaje: " Correo y/o password no coinciden"});
          }

        });
      } else {
        res.status(401).send({mensaje: " Correo y/o password no coinciden"});
      }
    }
  });
};

module.exports = {
  registrarUsuario,
  login,
};
