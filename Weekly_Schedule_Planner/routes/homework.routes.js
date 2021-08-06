'use strict'

// IMPORTACIONES
var express = require('express');
var homeworkController = require('../controllers/homework.controller');


// IMPORTACION MIDDLEWARES PARA RUTAS
var md_autorizacion = require('../middlewares/authenticated');

//RUTAS
var app = express.Router();
app.post('/saveHomework', md_autorizacion.ensureAuth, homeworkController.saveHomework);
app.get('/getHomeworks', md_autorizacion.ensureAuth, homeworkController.getHomeworks);
app.put('/updateHomework/:id', md_autorizacion.ensureAuth, homeworkController.updateHomework);
app.delete('/deleteHomework/:id', md_autorizacion.ensureAuth, homeworkController.deleteHomework);
app.get('/GetHomeworkID/:homeworkid', md_autorizacion.ensureAuth, homeworkController.GetHomeworkID);

module.exports = app;