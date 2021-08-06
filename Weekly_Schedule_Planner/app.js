'use strict'

// VARIABLES GLOBALES
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");

// IMPORTACION DE RUTAS
var usuario_routes = require("./routes/user.routes");
var horario_routes = require("./routes/schedule.routes");
var tarea_routes = require("./routes/homework.routes");


// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CABECERAS
app.use(cors());

// APLICACION DE RUTAS  localhost:3000/api/ejemplos
app.use('/api', usuario_routes, horario_routes);
app.use('/api',tarea_routes) ;

// EXPORTAR
module.exports = app;