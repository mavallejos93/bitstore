//Variable express
let express = require("express");
//importamos el controlador de usuario
let Usuario = require("../controllers/usuario")

//creamos la api

let api = express.Router();

//servicio POST (registrar)  http://localhost:3001/api/registrarUsuario

api.post("/registrarUsuario", Usuario.registrarUsuario);

api.post("/login", Usuario.login)

//exportamos el modulo
module.exports = api;