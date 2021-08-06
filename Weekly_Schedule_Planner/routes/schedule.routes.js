'use strict'

// IMPORTACIONES
var express = require('express');
var scheduleController = require('../controllers/schedule.controller');


// IMPORTACION MIDDLEWARES PARA RUTAS
var md_autorizacion = require('../middlewares/authenticated');

//RUTAS
var app = express.Router();
app.get('/getSchedules', md_autorizacion.ensureAuth, scheduleController.getSchedules);
app.get('/getScheduleID/:scheduleId', md_autorizacion.ensureAuth, scheduleController.getScheduleID);
app.put('/:id/UpdateSchedule/:idS', md_autorizacion.ensureAuth, scheduleController.UpdateSchedule);
app.delete('/:id/DeleteSchedule/:idS', md_autorizacion.ensureAuth, scheduleController.DeleteSchedule);
app.put('/:id/setSchedule', md_autorizacion.ensureAuth, scheduleController.setSchedule); 


module.exports = app;